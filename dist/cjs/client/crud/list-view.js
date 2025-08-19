"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListView = ListView;
exports.ListViewHeader = ListViewHeader;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const search_header_1 = require("./search-header");
const navigation_1 = require("next/navigation");
const utils_1 = require("../utils");
const provider_1 = require("../provider");
const react_query_1 = require("@tanstack/react-query");
const link_1 = __importDefault(require("next/link"));
function ListView({ data, endpoint, filters, queryParams, asChild, className, containerClassName, renderItem, keyExtractor, ListEmptyComponent, ListHeaderComponent, ListFooterComponent, ItemSeparatorComponent, refetchOnMount = true, }) {
    const Struct = (0, provider_1.useStructUI)();
    const [search, setSearch] = (0, react_1.useState)("");
    const { data: queryData, isLoading, error, refetch, } = (0, react_query_1.useQuery)({
        enabled: !!endpoint,
        queryKey: [endpoint, "list", Object.values(queryParams || {})],
        queryFn: () => (0, utils_1.fetcher)(`/api/${endpoint}`, { params: queryParams }),
        refetchOnWindowFocus: refetchOnMount,
    });
    const listData = (0, react_1.useMemo)(() => {
        const arr = (data ?? queryData ?? []);
        return (filters?.search?.length || search.length)
            ? arr.filter((item) => JSON.stringify(item).toLowerCase().includes((filters?.search || search).toLowerCase()))
            : arr;
    }, [data, queryData, search, filters]);
    const isEmpty = !listData || listData.length === 0;
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("flex flex-1 flex-col p-4 gap-4", className), children: [ListHeaderComponent ? ListHeaderComponent : ((0, jsx_runtime_1.jsx)(search_header_1.SearchHeader, { asChild: asChild, search: search, onChange: ({ target }) => setSearch(target.value) })), isLoading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-4", children: (0, jsx_runtime_1.jsx)(Struct.Loader, {}) })) : error ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-2 py-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-center text-destructive", children: "Erro ao carregar dados." }), (0, jsx_runtime_1.jsx)(Struct.Button, { variant: "outline", onClick: () => refetch(), children: "Tentar novamente" })] })) : isEmpty ? (ListEmptyComponent || (0, jsx_runtime_1.jsx)("p", { className: "text-center text-muted-foreground", children: "Nenhum item encontrado." })) : ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("flex flex-row flex-wrap gap-4", containerClassName), children: listData.map((item, index) => ((0, jsx_runtime_1.jsxs)("div", { children: [renderItem(item, index), ItemSeparatorComponent && index < listData.length - 1 && ItemSeparatorComponent] }, keyExtractor?.(item, index) ?? index))) })), ListFooterComponent] }));
}
function ListViewHeader({ onChange }) {
    const [search, setSearch] = (0, react_1.useState)("");
    const pathname = (0, navigation_1.usePathname)();
    const Struct = (0, provider_1.useStructUI)();
    (0, react_1.useEffect)(() => {
        if (onChange)
            onChange(search);
    }, [search, onChange]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-row justify-between items-center gap-4", children: [(0, jsx_runtime_1.jsx)(Struct.Input, { placeholder: "Pesquisar...", className: "max-w-xs", value: search, onChange: (e) => setSearch(e.target.value) }), (0, jsx_runtime_1.jsx)(Struct.Button, { as: link_1.default, href: pathname + "/register", className: "w-fit", children: "Adicionar Novo" })] }));
}
;
