"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useModalForm } from "./form/modal";
import { MoreVertical } from "lucide-react";
import { SearchHeader } from "./search-header";
import { useStructUI } from "../provider";
import { DataTable } from "./data-table";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../fetcher";
import Link from "next/link";
export function TableView({ columns, asChild, hideAdd = false, endpoint, queryParams, LeftItems, ListEmptyComponent, ListFooterComponent, ListHeaderComponent, }) {
    const [search, setSearch] = useState("");
    const Struct = useStructUI();
    const router = useRouter();
    const { data = [], isLoading } = useQuery({
        queryKey: [endpoint, "list"],
        queryFn: () => fetcher(`/api/${endpoint}`, { params: queryParams }),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    const enhancedColumns = [
        ...(columns || []),
        {
            id: "actions",
            header: "Ações",
            cell: ({ row }) => (_jsx(Cell, { parentAsChild: asChild, row: row, endpoint: endpoint, Struct: Struct, router: router })),
        },
    ];
    const filteredData = search
        ? data.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()))
        : data;
    return (_jsxs("div", { className: "flex flex-1 flex-col p-4 gap-4", children: [ListHeaderComponent ?? (_jsx(SearchHeader, { hideAdd: hideAdd, asChild: asChild, search: search, onChange: ({ target }) => setSearch(target.value), LeftItems: LeftItems })), isLoading ? (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx(Struct.Loader, {}) })) : filteredData.length === 0 ? (ListEmptyComponent ?? (_jsx("p", { className: "text-center text-muted-foreground mt-10", children: "Nenhum item encontrado." }))) : (_jsx(DataTable, { data: filteredData, columns: enhancedColumns })), ListFooterComponent] }));
}
const Cell = ({ row, endpoint, parentAsChild, }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { queryClient, ...Struct } = useStructUI();
    const { openModal } = useModalForm();
    const pathname = usePathname();
    const { _id } = row.original;
    return (_jsxs(_Fragment, { children: [_jsxs(Struct.Dropdown.Root, { children: [_jsx(Struct.Dropdown.Trigger, { asChild: true, children: _jsx(Struct.Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: _jsx(MoreVertical, { className: "size-4" }) }) }), _jsxs(Struct.Dropdown.Content, { align: "end", children: [_jsx(Struct.Dropdown.Item, { asChild: true, children: parentAsChild ? (_jsx("button", { className: "w-full", onClick: () => openModal({ id: _id }), children: "Editar" })) : (_jsx(Link, { href: `${pathname}/${_id}`, children: "Editar" })) }), _jsx(Struct.Dropdown.Item, { onClick: () => setDialogOpen(true), className: "text-destructive", children: "Excluir" })] })] }), _jsx(Struct.Dialog.Root, { open: dialogOpen, onOpenChange: setDialogOpen, children: _jsxs(Struct.Dialog.Content, { className: "sm:max-w-[425px]", children: [_jsxs(Struct.Dialog.Header, { children: [_jsx(Struct.Dialog.Title, { children: "Confirmar exclus\u00E3o" }), _jsx(Struct.Dialog.Description, { children: "Deseja excluir este item? Essa a\u00E7\u00E3o n\u00E3o poder\u00E1 ser desfeita." })] }), _jsxs(Struct.Dialog.Footer, { children: [_jsx(Struct.Button, { variant: "outline", onClick: () => setDialogOpen(false), children: "Cancelar" }), _jsx(Struct.Button, { variant: "destructive", onClick: () => {
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
                                    }, children: "Confirmar" })] })] }) })] }));
};
