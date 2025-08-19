"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, ReactNode } from "react";
import { useModalForm } from "./form/modal";
import { MoreVertical } from "lucide-react";
import { SearchHeader } from "./search-header";
import { useStructUI } from "../provider";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../utils";
import Link from "next/link";

type TableViewProps = {
  columns: any[];
  endpoint: string;
  hideAdd?: boolean;
  asChild?: boolean;
  queryParams?: Record<string, any>;
  LeftItems?: ReactNode;
  ListHeaderComponent?: ReactNode;
  ListEmptyComponent?: ReactNode;
  ListFooterComponent?: ReactNode;
};

export function TableView({
  columns,
  asChild,
  hideAdd = false,
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
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }: any) => (
        <Cell
          parentAsChild={asChild}
          row={row}
          endpoint={endpoint}
          Struct={Struct}
          router={router}
        />
      ),
    },
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
          hideAdd={hideAdd}
          asChild={asChild}
          search={search}
          onChange={({ target }) => setSearch(target.value)}
          LeftItems={LeftItems}
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
        <Struct.DataTable data={filteredData as any} columns={enhancedColumns} />
      )}

      {ListFooterComponent}
    </div>
  );
}

const Cell = ({
  row,
  endpoint,
  parentAsChild,
}: any) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { queryClient, ...Struct } = useStructUI();
  const { openModal } = useModalForm();
  const pathname = usePathname();
  const { _id } = row.original;

  return (
    <>
      <Struct.Dropdown.Root>
        <Struct.Dropdown.Trigger asChild>
          <Struct.Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="size-4" />
          </Struct.Button>
        </Struct.Dropdown.Trigger>
        <Struct.Dropdown.Content align="end">
          <Struct.Dropdown.Item asChild>
            {parentAsChild ? (
              <button className="w-full" onClick={() => openModal({ id: _id })}>
                Editar
              </button>
            ) : (
              <Link href={`${pathname}/${_id}`}>Editar</Link>
            )}
          </Struct.Dropdown.Item>
          <Struct.Dropdown.Item
            onClick={() => setDialogOpen(true)}
            className="text-destructive"
          >
            Excluir
          </Struct.Dropdown.Item>
        </Struct.Dropdown.Content>
      </Struct.Dropdown.Root>

      <Struct.Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Struct.Dialog.Content className="sm:max-w-[425px]">
          <Struct.Dialog.Header>
            <Struct.Dialog.Title>Confirmar exclusão</Struct.Dialog.Title>
            <Struct.Dialog.Description>
              Deseja excluir este item? Essa ação não poderá ser desfeita.
            </Struct.Dialog.Description>
          </Struct.Dialog.Header>
          <Struct.Dialog.Footer>
            <Struct.Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Struct.Button>
            <Struct.Button
              variant="destructive"
              onClick={() => {
                fetcher(`/api/${endpoint}/${_id}`, { method: "DELETE" })
                  .then(() => {
                    Struct.toast.success("Excluído com sucesso");
                    queryClient.invalidateQueries({ queryKey: [endpoint, "list"] });
                    setDialogOpen(false);
                  })
                  .catch((err) => {
                    Struct.toast.error(err.message || "Erro ao excluir");
                    console.error(err);
                    setDialogOpen(false);
                  });
              }}
            >
              Confirmar
            </Struct.Button>
          </Struct.Dialog.Footer>
        </Struct.Dialog.Content>
      </Struct.Dialog.Root>
    </>
  );
};
