"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ConfirmDialog, useConfirmDialog } from "../confirm-dialog";
import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useModalForm } from "./form/modal";
import { MoreVertical } from "lucide-react";
import { SearchHeader } from "./search-header";
import { useStructUI } from "../provider";
import { DataTable } from "./data-table";
import { fetcher } from "../../fetcher";
import Link from "next/link";
export function TableView({ columns, asChild, modalId, hideAdd = false, hideEdit = false, hideDuplicate = false, hideOptions = false, endpoint, queryParams, LeftItems, ListEmptyComponent, ListFooterComponent, ListHeaderComponent, enablePagination = false, pageSize = 10, }) {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const Struct = useStructUI();
    const router = useRouter();
    const { data: queryData, isLoading } = useQuery({
        queryKey: [endpoint, "list", currentPage, pageSize, search],
        queryFn: () => fetcher(`/api/${endpoint}`, {
            params: {
                ...queryParams,
                ...(search ? { search } : {}),
                ...(enablePagination ? { page: currentPage, limit: pageSize } : {})
            }
        }),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    const isPaginatedResponse = (data) => {
        return data && typeof data === 'object' && 'data' in data && 'page' in data && 'totalPages' in data;
    };
    const { items, paginationInfo } = useMemo(() => {
        let rawData = [];
        let pagination = null;
        if (queryData) {
            if (isPaginatedResponse(queryData)) {
                rawData = queryData.data;
                pagination = queryData;
            }
            else {
                rawData = queryData;
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
                cell: ({ row }) => (_jsx(Cell, { parentAsChild: asChild, row: row, endpoint: endpoint, Struct: Struct, router: router, modalId: modalId, hideEdit: hideEdit, hideDuplicate: hideDuplicate })),
            }]),
    ];
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    const renderPagination = () => {
        if (!enablePagination || !paginationInfo)
            return null;
        const { page, totalPages, total } = paginationInfo;
        if (totalPages <= 1)
            return null;
        return (_jsxs("div", { className: "flex items-center justify-between gap-4 pt-4", children: [_jsxs("div", { className: "text-sm text-muted-foreground", children: ["P\u00E1gina ", page, " de ", totalPages, " (", total, " ", total === 1 ? 'item' : 'itens', ")"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Struct.Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(page - 1), disabled: page <= 1, children: "Anterior" }), Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5)
                                pageNum = i + 1;
                            else if (page <= 3)
                                pageNum = i + 1;
                            else if (page >= totalPages - 2)
                                pageNum = totalPages - 4 + i;
                            else
                                pageNum = page - 2 + i;
                            return (_jsx(Struct.Button, { variant: page === pageNum ? "default" : "outline", size: "sm", onClick: () => handlePageChange(pageNum), children: pageNum }, pageNum));
                        }), _jsx(Struct.Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(page + 1), disabled: page >= totalPages, children: "Pr\u00F3xima" })] })] }));
    };
    const filteredData = search
        ? items.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()))
        : items;
    return (_jsxs("div", { className: "flex flex-1 flex-col p-4 gap-4", children: [ListHeaderComponent ?? (_jsx(SearchHeader, { modalId: modalId, hideAdd: hideAdd, asChild: asChild, search: search, onChange: ({ target }) => setSearch(target.value), LeftItems: typeof LeftItems === "function"
                    ? LeftItems?.(items) || LeftItems
                    : LeftItems })), isLoading ? (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx(Struct.Loader, {}) })) : items.length === 0 ? (ListEmptyComponent ?? (_jsx("p", { className: "text-center text-muted-foreground mt-10", children: "Nenhum item encontrado." }))) : (_jsxs(_Fragment, { children: [_jsx(DataTable, { data: filteredData, columns: enhancedColumns }), renderPagination()] })), ListFooterComponent] }));
}
const Cell = ({ row, endpoint, parentAsChild, modalId, hideDuplicate, hideEdit, }) => {
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
    return (_jsxs(_Fragment, { children: [_jsxs(Struct.Dropdown.Root, { children: [_jsx(Struct.Dropdown.Trigger, { asChild: true, children: _jsx(Struct.Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: _jsx(MoreVertical, { className: "size-4" }) }) }), _jsxs(Struct.Dropdown.Content, { align: "end", children: [!hideEdit && (_jsx(Struct.Dropdown.Item, { asChild: true, children: parentAsChild ? (_jsx("button", { className: "w-full", onClick: () => openModal({ id: _id, modalId }), children: "Editar" })) : (_jsx(Link, { href: `${pathname}/${_id}`, children: "Editar" })) })), !hideDuplicate && ( // 👈 condicional
                            _jsx(Struct.Dropdown.Item, { disabled: isPending, onClick: () => duplicateDialog.trigger(), children: isPending ? "Duplicando..." : "Duplicar" })), _jsx(Struct.Dropdown.Item, { onClick: () => setDeleteDialogOpen(true), className: "text-destructive", children: "Excluir" })] })] }), _jsx(ConfirmDialog, { open: duplicateDialog.open, onOpenChange: duplicateDialog.setOpen, title: "Duplicar item?", description: "Tem certeza que deseja duplicar este item?", variant: "default", onPress: () => duplicateItem(), onSuccess: () => duplicateDialog.setOpen(false) }), _jsx(ConfirmDialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, title: "Confirmar exclus\u00E3o", description: "Deseja realmente excluir este item? Essa a\u00E7\u00E3o n\u00E3o poder\u00E1 ser desfeita.", endpoint: endpoint, params: { id: _id }, method: "DELETE", variant: "destructive", onSuccess: () => {
                    Struct.toast.success("Excluído com sucesso!");
                    queryClient.invalidateQueries({ queryKey: [endpoint, "list"] });
                } })] }));
};
