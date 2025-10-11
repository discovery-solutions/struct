"use client";
import { ConfirmDialog, useConfirmDialog } from "../confirm-dialog";
import { useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, ReactNode } from "react";
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
  hideDuplicate?: boolean;
  hideOptions?: boolean;
  asChild?: boolean;
  modalId?: string;
  queryParams?: Record<string, any>;
  LeftItems?: ((data: any) => ReactNode) | ReactNode;
  ListHeaderComponent?: ReactNode;
  ListEmptyComponent?: ReactNode;
  ListFooterComponent?: ReactNode;
};

export function TableView({
  columns,
  asChild,
  modalId,
  hideAdd = false,
  hideDuplicate = false,
  hideOptions = false,
  endpoint,
  queryParams,
  LeftItems,
  ListEmptyComponent,
  ListFooterComponent,
  ListHeaderComponent,
}: TableViewProps) {
  const [search, setSearch] = useState("");
  const Struct = useStructUI();
  const router = useRouter();

  const { data = [], isLoading } = useQuery({
    queryKey: [endpoint, "list"],
    queryFn: () => fetcher(`/api/${endpoint}`, { params: queryParams }) as any,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

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
          hideDuplicate={hideDuplicate}
        />
      ),
    }]),
  ];

  const filteredData = search
    ? (data as any[]).filter((item) =>
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    )
    : data;

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
              ? LeftItems?.(filteredData) || LeftItems
              : LeftItems
          }
        />
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Struct.Loader />
        </div>
      ) : filteredData.length === 0 ? (
        ListEmptyComponent ?? (
          <p className="text-center text-muted-foreground mt-10">
            Nenhum item encontrado.
          </p>
        )
      ) : (
        <DataTable data={filteredData as any} columns={enhancedColumns} />
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
