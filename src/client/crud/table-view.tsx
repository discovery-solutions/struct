"use client";
import { ConfirmDialog, useConfirmDialog } from "../confirm-dialog";
import { useState, ReactNode, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PaginatedResponse } from "../types";
import { useModalForm } from "./form/modal";
import { MoreVertical } from "lucide-react";
import { SearchHeader } from "./search-header";
import { useStructUI } from "../provider";
import { DataTable } from "./data-table";
import { fetcher } from "../../fetcher";
import Link from "next/link";

export type TableViewProps = {
  columns: any[];
  endpoint: string;
  hideAdd?: boolean;
  hideEdit?: boolean;
  hideDuplicate?: boolean;
  hideOptions?: boolean;
  asChild?: boolean;
  modalId?: string;
  queryParams?: Record<string, any>;
  LeftItems?: ((data: any) => ReactNode) | ReactNode;
  ListHeaderComponent?: ReactNode;
  ListEmptyComponent?: ReactNode;
  ListFooterComponent?: ReactNode;
  enablePagination?: boolean;
  pageSize?: number;
};

export function TableView({
  columns,
  asChild,
  modalId,
  hideAdd = false,
  hideEdit = false,
  hideDuplicate = false,
  hideOptions = false,
  endpoint,
  queryParams,
  LeftItems,
  ListEmptyComponent,
  ListFooterComponent,
  ListHeaderComponent,
  enablePagination = false,
  pageSize = 10,
}: TableViewProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const Struct = useStructUI();
  const router = useRouter();

  const { data: queryData, isLoading } = useQuery<any | PaginatedResponse<any>>({
    queryKey: [endpoint, "list", currentPage, pageSize, search],
    queryFn: () => fetcher(`/api/${endpoint}`, {
      params: {
        ...queryParams,
        ...(search ? { search } : {}),
        ...(enablePagination ? { page: currentPage, limit: pageSize } : {})
      }
    }) as any,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const isPaginatedResponse = (data: any): data is PaginatedResponse<any> => {
    return data && typeof data === 'object' && 'data' in data && 'page' in data && 'totalPages' in data;
  };

  const { items, paginationInfo } = useMemo(() => {
    let rawData: any[] = [];
    let pagination: PaginatedResponse<any> | null = null;

    if (queryData) {
      if (isPaginatedResponse(queryData)) {
        rawData = queryData.data;
        pagination = queryData;
      } else {
        rawData = queryData.data as any[];
      }
    }

    return {
      items: rawData,
      paginationInfo: pagination
    };
  }, [queryData]);

  const enhancedColumns = [
    ...(columns || []),
    ...(hideOptions ? [] : [{
      id: "actions",
      header: "Ações",
      cell: ({ row }: any) => (
        <Cell
          parentAsChild={asChild}
          row={row}
          endpoint={endpoint}
          Struct={Struct}
          router={router}
          modalId={modalId}
          hideEdit={hideEdit}
          hideDuplicate={hideDuplicate}
        />
      ),
    }]),
  ];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const renderPagination = () => {
    if (!enablePagination || !paginationInfo) return null;

    const { page, totalPages, total } = paginationInfo;

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between gap-4 pt-4">
        <div className="text-sm text-muted-foreground">
          Página {page} de {totalPages} ({total} {total === 1 ? 'item' : 'itens'})
        </div>
        <div className="flex gap-2">
          <Struct.Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Anterior
          </Struct.Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) pageNum = i + 1;
            else if (page <= 3) pageNum = i + 1;
            else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = page - 2 + i;

            return (
              <Struct.Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Struct.Button>
            );
          })}

          <Struct.Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Próxima
          </Struct.Button>
        </div>
      </div>
    );
  };

  const filteredData = search
    ? (items as any[]).filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    )
    : items;

  return (
    <div className="flex flex-1 flex-col p-4 gap-4">
      {ListHeaderComponent ?? (
        <SearchHeader
          modalId={modalId}
          hideAdd={hideAdd}
          asChild={asChild}
          search={search}
          onChange={({ target }) => setSearch(target.value)}
          LeftItems={
            typeof LeftItems === "function"
              ? LeftItems?.(items) || LeftItems
              : LeftItems
          }
        />
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Struct.Loader />
        </div>
      ) : items.length === 0 ? (
        ListEmptyComponent ?? (
          <p className="text-center text-muted-foreground mt-10">
            Nenhum item encontrado.
          </p>
        )
      ) : (
        <>
          <DataTable data={filteredData as any} columns={enhancedColumns} />
          {renderPagination()}
        </>
      )}

      {ListFooterComponent}
    </div>
  );
}

const Cell = ({
  row,
  endpoint,
  parentAsChild,
  modalId,
  hideDuplicate,
  hideEdit,
}: any) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const duplicateDialog = useConfirmDialog();
  const { queryClient, ...Struct } = useStructUI();
  const { openModal } = useModalForm();
  const pathname = usePathname();
  const { _id, ...originalData } = row.original;

  const { mutate: duplicateItem, isPending } = useMutation({
    mutationFn: async () => {
      const cloneData = { ...originalData };
      delete cloneData._id;
      delete cloneData.createdAt;
      delete cloneData.updatedAt;

      return fetcher(`/api/${endpoint}`, {
        method: "POST",
        body: cloneData,
      });
    },
    onSuccess: () => {
      Struct.toast.success("Item duplicado com sucesso!");
      queryClient.invalidateQueries({ queryKey: [endpoint, "list"] });
    },
    onError: (err: any) => {
      console.error(err);
      Struct.toast.error(err.message || "Erro ao duplicar item.");
    },
  });

  return (
    <>
      <Struct.Dropdown.Root>
        <Struct.Dropdown.Trigger asChild>
          <Struct.Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="size-4" />
          </Struct.Button>
        </Struct.Dropdown.Trigger>

        <Struct.Dropdown.Content align="end">
          {/* Editar */}
          {!hideEdit && (
            <Struct.Dropdown.Item asChild>
              {parentAsChild ? (
                <button
                  className="w-full"
                  onClick={() => openModal({ id: _id, modalId })}
                >
                  Editar
                </button>
              ) : (
                <Link href={`${pathname}/${_id}`}>Editar</Link>
              )}
            </Struct.Dropdown.Item>
          )}

          {/* Duplicar */}
          {!hideDuplicate && ( // 👈 condicional
            <Struct.Dropdown.Item
              disabled={isPending}
              onClick={() => duplicateDialog.trigger()}
            >
              {isPending ? "Duplicando..." : "Duplicar"}
            </Struct.Dropdown.Item>
          )}

          {/* Excluir */}
          <Struct.Dropdown.Item
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive"
          >
            Excluir
          </Struct.Dropdown.Item>
        </Struct.Dropdown.Content>
      </Struct.Dropdown.Root>

      {/* 🔁 Confirmação de duplicação */}
      <ConfirmDialog
        open={duplicateDialog.open}
        onOpenChange={duplicateDialog.setOpen}
        title="Duplicar item?"
        description="Tem certeza que deseja duplicar este item?"
        variant="default"
        onPress={() => duplicateItem()}
        onSuccess={() => duplicateDialog.setOpen(false)}
      />

      {/* 🗑️ Confirmação de exclusão */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Confirmar exclusão"
        description="Deseja realmente excluir este item? Essa ação não poderá ser desfeita."
        endpoint={endpoint}
        params={{ id: _id }}
        method="DELETE"
        variant="destructive"
        onSuccess={() => {
          Struct.toast.success("Excluído com sucesso!");
          queryClient.invalidateQueries({ queryKey: [endpoint, "list"] });
        }}
      />
    </>
  );
};
