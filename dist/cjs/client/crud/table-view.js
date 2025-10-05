"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableView = TableView;
const jsx_runtime_1 = require("react/jsx-runtime");
const confirm_dialog_1 = require("../confirm-dialog");
const navigation_1 = require("next/navigation");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const modal_1 = require("./form/modal");
const lucide_react_1 = require("lucide-react");
const search_header_1 = require("./search-header");
const provider_1 = require("../provider");
const data_table_1 = require("./data-table");
const fetcher_1 = require("../../fetcher");
const link_1 = __importDefault(require("next/link"));
function TableView({ columns, asChild, modalId, hideAdd = false, hideDuplicate = false, endpoint, queryParams, LeftItems, ListEmptyComponent, ListFooterComponent, ListHeaderComponent, }) {
    const [search, setSearch] = (0, react_1.useState)("");
    const Struct = (0, provider_1.useStructUI)();
    const router = (0, navigation_1.useRouter)();
    const { data = [], isLoading } = (0, react_query_1.useQuery)({
        queryKey: [endpoint, "list"],
        queryFn: () => (0, fetcher_1.fetcher)(`/api/${endpoint}`, { params: queryParams }),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    const enhancedColumns = [
        ...(columns || []),
        {
            id: "actions",
            header: "Ações",
            cell: ({ row }) => ((0, jsx_runtime_1.jsx)(Cell, { parentAsChild: asChild, row: row, endpoint: endpoint, Struct: Struct, router: router, modalId: modalId, hideDuplicate: hideDuplicate })),
        },
    ];
    const filteredData = search
        ? data.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()))
        : data;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-1 flex-col p-4 gap-4", children: [ListHeaderComponent ?? ((0, jsx_runtime_1.jsx)(search_header_1.SearchHeader, { modalId: modalId, hideAdd: hideAdd, asChild: asChild, search: search, onChange: ({ target }) => setSearch(target.value), LeftItems: typeof LeftItems === "function"
                    ? LeftItems?.(filteredData) || LeftItems
                    : LeftItems })), isLoading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-full", children: (0, jsx_runtime_1.jsx)(Struct.Loader, {}) })) : filteredData.length === 0 ? (ListEmptyComponent ?? ((0, jsx_runtime_1.jsx)("p", { className: "text-center text-muted-foreground mt-10", children: "Nenhum item encontrado." }))) : ((0, jsx_runtime_1.jsx)(data_table_1.DataTable, { data: filteredData, columns: enhancedColumns })), ListFooterComponent] }));
}
const Cell = ({ row, endpoint, parentAsChild, modalId, hideDuplicate }) => {
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
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Struct.Dropdown.Root, { children: [(0, jsx_runtime_1.jsx)(Struct.Dropdown.Trigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(Struct.Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVertical, { className: "size-4" }) }) }), (0, jsx_runtime_1.jsxs)(Struct.Dropdown.Content, { align: "end", children: [(0, jsx_runtime_1.jsx)(Struct.Dropdown.Item, { asChild: true, children: parentAsChild ? ((0, jsx_runtime_1.jsx)("button", { className: "w-full", onClick: () => openModal({ id: _id, modalId }), children: "Editar" })) : ((0, jsx_runtime_1.jsx)(link_1.default, { href: `${pathname}/${_id}`, children: "Editar" })) }), !hideDuplicate && ( // 👈 condicional
                            (0, jsx_runtime_1.jsx)(Struct.Dropdown.Item, { disabled: isPending, onClick: () => duplicateDialog.trigger(), children: isPending ? "Duplicando..." : "Duplicar" })), (0, jsx_runtime_1.jsx)(Struct.Dropdown.Item, { onClick: () => setDeleteDialogOpen(true), className: "text-destructive", children: "Excluir" })] })] }), (0, jsx_runtime_1.jsx)(confirm_dialog_1.ConfirmDialog, { open: duplicateDialog.open, onOpenChange: duplicateDialog.setOpen, title: "Duplicar item?", description: "Tem certeza que deseja duplicar este item?", variant: "default", onPress: () => duplicateItem(), onSuccess: () => duplicateDialog.setOpen(false) }), (0, jsx_runtime_1.jsx)(confirm_dialog_1.ConfirmDialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, title: "Confirmar exclus\u00E3o", description: "Deseja realmente excluir este item? Essa a\u00E7\u00E3o n\u00E3o poder\u00E1 ser desfeita.", endpoint: endpoint, params: { id: _id }, method: "DELETE", variant: "destructive", onSuccess: () => {
                    Struct.toast.success("Excluído com sucesso!");
                    queryClient.invalidateQueries({ queryKey: [endpoint, "list"] });
                } })] }));
};
