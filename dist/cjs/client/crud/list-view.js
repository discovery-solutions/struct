"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListView = ListView;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const search_header_1 = require("./search-header");
const provider_1 = require("../provider");
const react_query_1 = require("@tanstack/react-query");
const fetcher_1 = require("../../fetcher");
const utils_1 = require("../utils");
function ListView({ data, endpoint, filters, queryParams, asChild, className, containerClassName, renderItem, keyExtractor, ListItemWrapper = react_1.Fragment, ListEmptyComponent, ListHeaderComponent, ListFooterComponent, ItemSeparatorComponent, refetchOnMount = true, showNewButton = true, enablePagination = false, pageSize = 10, hideAdd = false, }) {
    const Struct = (0, provider_1.useStructUI)();
    const [search, setSearch] = (0, react_1.useState)("");
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const { data: queryData, isLoading, error, refetch, } = (0, react_query_1.useQuery)({
        enabled: !!endpoint,
        queryKey: [endpoint, "list", currentPage, pageSize, Object.values(queryParams || {})],
        queryFn: () => (0, fetcher_1.fetcher)(`/api/${endpoint}`, {
            params: {
                ...queryParams,
                ...(enablePagination ? { page: currentPage, limit: pageSize } : {})
            }
        }),
        refetchOnWindowFocus: refetchOnMount,
    });
    // Detecta se a resposta é paginada ou array puro
    const isPaginatedResponse = (data) => {
        return data && typeof data === 'object' && 'data' in data && 'page' in data && 'totalPages' in data;
    };
    const { items, paginationInfo } = (0, react_1.useMemo)(() => {
        let rawData = [];
        let pagination = null;
        if (data) {
            rawData = data;
        }
        else if (queryData) {
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
    }, [data, queryData]);
    const listData = (0, react_1.useMemo)(() => {
        const arr = items ?? [];
        return (filters?.search?.length || search.length)
            ? arr.filter((item) => JSON.stringify(item).toLowerCase().includes((filters?.search || search).toLowerCase()))
            : arr;
    }, [items, search, filters]);
    const isEmpty = !listData || listData.length === 0;
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
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            }
                            else if (page <= 3) {
                                pageNum = i + 1;
                            }
                            else if (page >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            }
                            else {
                                pageNum = page - 2 + i;
                            }
                            return ((0, jsx_runtime_1.jsx)(Struct.Button, { variant: page === pageNum ? "default" : "outline", size: "sm", onClick: () => handlePageChange(pageNum), children: pageNum }, pageNum));
                        }), (0, jsx_runtime_1.jsx)(Struct.Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(page + 1), disabled: page >= totalPages, children: "Pr\u00F3xima" })] })] }));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("flex flex-1 flex-col p-4 gap-4", className), children: [ListHeaderComponent ? ListHeaderComponent : ((0, jsx_runtime_1.jsx)(search_header_1.SearchHeader, { asChild: asChild, search: search, onChange: ({ target }) => setSearch(target.value), hideAdd: hideAdd === false ? false : !showNewButton })), isLoading ? ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-4", children: (0, jsx_runtime_1.jsx)(Struct.Loader, {}) })) : (error && listData.length < 1) ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-2 py-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-center text-destructive", children: "Erro ao carregar dados." }), (0, jsx_runtime_1.jsx)(Struct.Button, { variant: "outline", onClick: () => refetch(), children: "Tentar novamente" })] })) : isEmpty ? (ListEmptyComponent || (0, jsx_runtime_1.jsx)("p", { className: "text-center text-muted-foreground", children: "Nenhum item encontrado." })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("flex flex-row flex-wrap gap-4", containerClassName), children: listData.map((item, index) => ((0, jsx_runtime_1.jsxs)(ListItemWrapper, { children: [renderItem(item, index), ItemSeparatorComponent && index < listData.length - 1 && ItemSeparatorComponent] }, keyExtractor?.(item, index) ?? index))) }), renderPagination()] })), ListFooterComponent] }));
}
