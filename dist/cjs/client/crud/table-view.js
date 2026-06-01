"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableView = TableView;
const jsx_runtime_1 = require("react/jsx-runtime");
const confirm_dialog_1 = require("../confirm-dialog");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const react_query_1 = require("@tanstack/react-query");
const modal_1 = require("./form/modal");
const lucide_react_1 = require("lucide-react");
const search_header_1 = require("./search-header");
const provider_1 = require("../provider");
const data_table_1 = require("./data-table");
const fetcher_1 = require("../../fetcher");
const link_1 = __importDefault(require("next/link"));
function TableView({ columns, asChild, modalId, hideAdd = false, hideEdit = false, hideDuplicate = false, hideOptions = false, endpoint, queryParams, LeftItems, ListEmptyComponent, ListFooterComponent, ListHeaderComponent, enablePagination = false, pageSize = 10, }) {
    const [search, setSearch] = (0, react_1.useState)("");
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const Struct = (0, provider_1.useStructUI)();
    const router = (0, navigation_1.useRouter)();
    const { data: queryData, isLoading } = (0, react_query_1.useQuery)({
        queryKey: [endpoint, "list", currentPage, pageSize, search],
        queryFn: () => (0, fetcher_1.fetcher)(`/api/${endpoint}`, {
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
    const { items, paginationInfo } = (0, react_1.useMemo)(() => {
        let rawData = [];
        let pagination = null;
        if (queryData) {
            if (isPaginatedResponse(queryData)) {
                rawData = queryData.data;
                pagination = queryData;
            }
            else {
                rawData = queryData.data;
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
                cell: ({ row }) => ((0, jsx_runtime_1.jsx)(Cell, { parentAsChild: asChild, row: row, endpoint: endpoint, Struct: Struct, router: router, modalId: modalId, hideEdit: hideEdit, hideDuplicate: hideDuplicate })),
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
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between gap-4 pt-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-muted-foreground", children: ["P\u00E1gina ", page, " de ", totalPages, " (", total, " ", total === 1 ? 'item' : 'itens', ")"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(Struct.Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(page - 1), disabled: page <= 1, children: "Anterior" }), Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5)
                                pageNum = i + 1;
                            else if (page <= 3)
                                pageNum = i + 1;
                            else if (page >= totalPages - 2)
                                pageNum = totalPages - 4 + i;
                            else
                                pageNum = page - 2 + i;
                            return ((0, jsx_runtime_1.jsx)(Struct.Button, { variant: page === pageNum ? "default" : "outline", size: "sm", onClick: () => handlePageChange(pageNum), children: pageNum }, pageNum));
                        }), (0, jsx_runtime_1.jsx)(Struct.Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(page + 1), disabled: page >= totalPages, children: "Pr\u00F3xima" })] })] }));
    };
    const filteredData = search
        ? items.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()))
        : items;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-1 flex-col p-4 gap-4", children: [ListHeaderComponent ?? ((0, jsx_runtime_1.jsx)(search_header_1.SearchHeader, { modalId: modalId, hideAdd: hideAdd, asChild: asChild, search: search, onChange: ({ target }) => setSearch(target.value), LeftItems: typeof LeftItems === "function"
                    ? LeftItems?.(items) || LeftItems
                    : LeftItems })), isLoading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-full", children: (0, jsx_runtime_1.jsx)(Struct.Loader, {}) })) : items.length === 0 ? (ListEmptyComponent ?? ((0, jsx_runtime_1.jsx)("p", { className: "text-center text-muted-foreground mt-10", children: "Nenhum item encontrado." }))) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(data_table_1.DataTable, { data: filteredData, columns: enhancedColumns }), renderPagination()] })), ListFooterComponent] }));
}
const Cell = ({ row, endpoint, parentAsChild, modalId, hideDuplicate, hideEdit, }) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = (0, react_1.useState)(false);
    const duplicateDialog = (0, confirm_dialog_1.useConfirmDialog)();
    const { queryClient, ...Struct } = (0, provider_1.useStructUI)();
    const { openModal } = (0, modal_1.useModalForm)();
    const pathname = (0, navigation_1.usePathname)();
    const { _id, ...originalData } = row.original;
    const { mutate: duplicateItem, isPending } = (0, react_query_1.useMutation)({
        mutationFn: async () => {
            const cloneData = { ...originalData };
            delete cloneData._id;
            delete cloneData.createdAt;
            delete cloneData.updatedAt;
            return (0, fetcher_1.fetcher)(`/api/${endpoint}`, {
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
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Struct.Dropdown.Root, { children: [(0, jsx_runtime_1.jsx)(Struct.Dropdown.Trigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(Struct.Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVertical, { className: "size-4" }) }) }), (0, jsx_runtime_1.jsxs)(Struct.Dropdown.Content, { align: "end", children: [!hideEdit && ((0, jsx_runtime_1.jsx)(Struct.Dropdown.Item, { asChild: true, children: parentAsChild ? ((0, jsx_runtime_1.jsx)("button", { className: "w-full", onClick: () => openModal({ id: _id, modalId }), children: "Editar" })) : ((0, jsx_runtime_1.jsx)(link_1.default, { href: `${pathname}/${_id}`, children: "Editar" })) })), !hideDuplicate && ( // 👈 condicional
                            (0, jsx_runtime_1.jsx)(Struct.Dropdown.Item, { disabled: isPending, onClick: () => duplicateDialog.trigger(), children: isPending ? "Duplicando..." : "Duplicar" })), (0, jsx_runtime_1.jsx)(Struct.Dropdown.Item, { onClick: () => setDeleteDialogOpen(true), className: "text-destructive", children: "Excluir" })] })] }), (0, jsx_runtime_1.jsx)(confirm_dialog_1.ConfirmDialog, { open: duplicateDialog.open, onOpenChange: duplicateDialog.setOpen, title: "Duplicar item?", description: "Tem certeza que deseja duplicar este item?", variant: "default", onPress: () => duplicateItem(), onSuccess: () => duplicateDialog.setOpen(false) }), (0, jsx_runtime_1.jsx)(confirm_dialog_1.ConfirmDialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, title: "Confirmar exclus\u00E3o", description: "Deseja realmente excluir este item? Essa a\u00E7\u00E3o n\u00E3o poder\u00E1 ser desfeita.", endpoint: endpoint, params: { id: _id }, method: "DELETE", variant: "destructive", onSuccess: () => {
                    Struct.toast.success("Excluído com sucesso!");
                    queryClient.invalidateQueries({ queryKey: [endpoint, "list"] });
                } })] }));
};
