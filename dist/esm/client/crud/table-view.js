"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ConfirmDialog, useConfirmDialog } from "../confirm-dialog";
import { useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useModalForm } from "./form/modal";
import { MoreVertical } from "lucide-react";
import { SearchHeader } from "./search-header";
import { useStructUI } from "../provider";
import { DataTable } from "./data-table";
import { fetcher } from "../../fetcher";
import Link from "next/link";
export function TableView({ columns, asChild, modalId, hideAdd = false, hideDuplicate = false, hideOptions = false, endpoint, queryParams, LeftItems, ListEmptyComponent, ListFooterComponent, ListHeaderComponent, }) {
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
        ...(hideOptions ? [] : [{
                id: "actions",
                header: "Ações",
                cell: ({ row }) => (_jsx(Cell, { parentAsChild: asChild, row: row, endpoint: endpoint, Struct: Struct, router: router, modalId: modalId, hideDuplicate: hideDuplicate })),
            }]),
    ];
    const filteredData = search
        ? data.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()))
        : data;
    return (_jsxs("div", { className: "flex flex-1 flex-col p-4 gap-4", children: [ListHeaderComponent ?? (_jsx(SearchHeader, { modalId: modalId, hideAdd: hideAdd, asChild: asChild, search: search, onChange: ({ target }) => setSearch(target.value), LeftItems: typeof LeftItems === "function"
                    ? LeftItems?.(filteredData) || LeftItems
                    : LeftItems })), isLoading ? (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx(Struct.Loader, {}) })) : filteredData.length === 0 ? (ListEmptyComponent ?? (_jsx("p", { className: "text-center text-muted-foreground mt-10", children: "Nenhum item encontrado." }))) : (_jsx(DataTable, { data: filteredData, columns: enhancedColumns })), ListFooterComponent] }));
}
const Cell = ({ row, endpoint, parentAsChild, modalId, hideDuplicate, }) => {
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
        onError: (err) => {
            console.error(err);
            Struct.toast.error(err.message || "Erro ao duplicar item.");
        },
    });
    return (_jsxs(_Fragment, { children: [_jsxs(Struct.Dropdown.Root, { children: [_jsx(Struct.Dropdown.Trigger, { asChild: true, children: _jsx(Struct.Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: _jsx(MoreVertical, { className: "size-4" }) }) }), _jsxs(Struct.Dropdown.Content, { align: "end", children: [_jsx(Struct.Dropdown.Item, { asChild: true, children: parentAsChild ? (_jsx("button", { className: "w-full", onClick: () => openModal({ id: _id, modalId }), children: "Editar" })) : (_jsx(Link, { href: `${pathname}/${_id}`, children: "Editar" })) }), !hideDuplicate && ( // 👈 condicional
                            _jsx(Struct.Dropdown.Item, { disabled: isPending, onClick: () => duplicateDialog.trigger(), children: isPending ? "Duplicando..." : "Duplicar" })), _jsx(Struct.Dropdown.Item, { onClick: () => setDeleteDialogOpen(true), className: "text-destructive", children: "Excluir" })] })] }), _jsx(ConfirmDialog, { open: duplicateDialog.open, onOpenChange: duplicateDialog.setOpen, title: "Duplicar item?", description: "Tem certeza que deseja duplicar este item?", variant: "default", onPress: () => duplicateItem(), onSuccess: () => duplicateDialog.setOpen(false) }), _jsx(ConfirmDialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, title: "Confirmar exclus\u00E3o", description: "Deseja realmente excluir este item? Essa a\u00E7\u00E3o n\u00E3o poder\u00E1 ser desfeita.", endpoint: endpoint, params: { id: _id }, method: "DELETE", variant: "destructive", onSuccess: () => {
                    Struct.toast.success("Excluído com sucesso!");
                    queryClient.invalidateQueries({ queryKey: [endpoint, "list"] });
                } })] }));
};
