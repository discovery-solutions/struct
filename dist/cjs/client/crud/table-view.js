"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableView = TableView;
const jsx_runtime_1 = require("react/jsx-runtime");
const navigation_1 = require("next/navigation");
const react_1 = require("react");
const modal_1 = require("./form/modal");
const lucide_react_1 = require("lucide-react");
const search_header_1 = require("./search-header");
const provider_1 = require("../provider");
const data_table_1 = require("./data-table");
const react_query_1 = require("@tanstack/react-query");
const utils_1 = require("../utils");
const link_1 = __importDefault(require("next/link"));
function TableView({ columns, asChild, hideAdd = false, endpoint, queryParams, LeftItems, ListEmptyComponent, ListFooterComponent, ListHeaderComponent, }) {
    const [search, setSearch] = (0, react_1.useState)("");
    const Struct = (0, provider_1.useStructUI)();
    const router = (0, navigation_1.useRouter)();
    const { data = [], isLoading } = (0, react_query_1.useQuery)({
        queryKey: [endpoint, "list"],
        queryFn: () => (0, utils_1.fetcher)(`/api/${endpoint}`, { params: queryParams }),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    const enhancedColumns = [
        ...(columns || []),
        {
            id: "actions",
            header: "Ações",
            cell: ({ row }) => ((0, jsx_runtime_1.jsx)(Cell, { parentAsChild: asChild, row: row, endpoint: endpoint, Struct: Struct, router: router })),
        },
    ];
    const filteredData = search
        ? data.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()))
        : data;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-1 flex-col p-4 gap-4", children: [ListHeaderComponent ?? ((0, jsx_runtime_1.jsx)(search_header_1.SearchHeader, { hideAdd: hideAdd, asChild: asChild, search: search, onChange: ({ target }) => setSearch(target.value), LeftItems: LeftItems })), isLoading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-full", children: (0, jsx_runtime_1.jsx)(Struct.Loader, {}) })) : filteredData.length === 0 ? (ListEmptyComponent ?? ((0, jsx_runtime_1.jsx)("p", { className: "text-center text-muted-foreground mt-10", children: "Nenhum item encontrado." }))) : ((0, jsx_runtime_1.jsx)(data_table_1.DataTable, { data: filteredData, columns: enhancedColumns })), ListFooterComponent] }));
}
const Cell = ({ row, endpoint, parentAsChild, }) => {
    const [dialogOpen, setDialogOpen] = (0, react_1.useState)(false);
    const { queryClient, ...Struct } = (0, provider_1.useStructUI)();
    const { openModal } = (0, modal_1.useModalForm)();
    const pathname = (0, navigation_1.usePathname)();
    const { _id } = row.original;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Struct.Dropdown.Root, { children: [(0, jsx_runtime_1.jsx)(Struct.Dropdown.Trigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(Struct.Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVertical, { className: "size-4" }) }) }), (0, jsx_runtime_1.jsxs)(Struct.Dropdown.Content, { align: "end", children: [(0, jsx_runtime_1.jsx)(Struct.Dropdown.Item, { asChild: true, children: parentAsChild ? ((0, jsx_runtime_1.jsx)("button", { className: "w-full", onClick: () => openModal({ id: _id }), children: "Editar" })) : ((0, jsx_runtime_1.jsx)(link_1.default, { href: `${pathname}/${_id}`, children: "Editar" })) }), (0, jsx_runtime_1.jsx)(Struct.Dropdown.Item, { onClick: () => setDialogOpen(true), className: "text-destructive", children: "Excluir" })] })] }), (0, jsx_runtime_1.jsx)(Struct.Dialog.Root, { open: dialogOpen, onOpenChange: setDialogOpen, children: (0, jsx_runtime_1.jsxs)(Struct.Dialog.Content, { className: "sm:max-w-[425px]", children: [(0, jsx_runtime_1.jsxs)(Struct.Dialog.Header, { children: [(0, jsx_runtime_1.jsx)(Struct.Dialog.Title, { children: "Confirmar exclus\u00E3o" }), (0, jsx_runtime_1.jsx)(Struct.Dialog.Description, { children: "Deseja excluir este item? Essa a\u00E7\u00E3o n\u00E3o poder\u00E1 ser desfeita." })] }), (0, jsx_runtime_1.jsxs)(Struct.Dialog.Footer, { children: [(0, jsx_runtime_1.jsx)(Struct.Button, { variant: "outline", onClick: () => setDialogOpen(false), children: "Cancelar" }), (0, jsx_runtime_1.jsx)(Struct.Button, { variant: "destructive", onClick: () => {
                                        (0, utils_1.fetcher)(`/api/${endpoint}/${_id}`, { method: "DELETE" })
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
