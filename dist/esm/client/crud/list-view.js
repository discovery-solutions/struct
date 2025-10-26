"use client";
import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { SearchHeader } from "./search-header";
import { usePathname } from "next/navigation";
import { useStructUI } from "../provider";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../fetcher";
import { cn } from "../utils";
import Link from "next/link";
export function ListView({ data, endpoint, filters, queryParams, asChild, className, containerClassName, renderItem, keyExtractor, ListEmptyComponent, ListHeaderComponent, ListFooterComponent, ItemSeparatorComponent, refetchOnMount = true, showNewButton = true, enablePagination = false, pageSize = 10 }) {
    const Struct = useStructUI();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const { data: queryData, isLoading, error, refetch, } = useQuery({
        enabled: !!endpoint,
        queryKey: [endpoint, "list", currentPage, pageSize, Object.values(queryParams || {})],
        queryFn: () => fetcher(`/api/${endpoint}`, {
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
    const { items, paginationInfo } = useMemo(() => {
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
    const listData = useMemo(() => {
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
        return (_jsxs("div", { className: "flex items-center justify-between gap-4 pt-4", children: [_jsxs("div", { className: "text-sm text-muted-foreground", children: ["P\u00E1gina ", page, " de ", totalPages, " (", total, " ", total === 1 ? 'item' : 'itens', ")"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Struct.Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(page - 1), disabled: page <= 1, children: "Anterior" }), Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                            return (_jsx(Struct.Button, { variant: page === pageNum ? "default" : "outline", size: "sm", onClick: () => handlePageChange(pageNum), children: pageNum }, pageNum));
                        }), _jsx(Struct.Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(page + 1), disabled: page >= totalPages, children: "Pr\u00F3xima" })] })] }));
    };
    return (_jsxs("div", { className: cn("flex flex-1 flex-col p-4 gap-4", className), children: [ListHeaderComponent ? ListHeaderComponent : (_jsx(SearchHeader, { asChild: asChild, search: search, onChange: ({ target }) => setSearch(target.value), hideAdd: !showNewButton })), isLoading ? (_jsx("div", { className: "flex justify-center py-4", children: _jsx(Struct.Loader, {}) })) : (error && listData.length < 1) ? (_jsxs("div", { className: "flex flex-col items-center gap-2 py-4", children: [_jsx("p", { className: "text-center text-destructive", children: "Erro ao carregar dados." }), _jsx(Struct.Button, { variant: "outline", onClick: () => refetch(), children: "Tentar novamente" })] })) : isEmpty ? (ListEmptyComponent || _jsx("p", { className: "text-center text-muted-foreground", children: "Nenhum item encontrado." })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: cn("flex flex-row flex-wrap gap-4", containerClassName), children: listData.map((item, index) => (_jsxs("div", { children: [renderItem(item, index), ItemSeparatorComponent && index < listData.length - 1 && ItemSeparatorComponent] }, keyExtractor?.(item, index) ?? index))) }), renderPagination()] })), ListFooterComponent] }));
}
export function ListViewHeader({ onChange }) {
    const [search, setSearch] = useState("");
    const pathname = usePathname();
    const Struct = useStructUI();
    useEffect(() => {
        if (onChange)
            onChange(search);
    }, [search, onChange]);
    return (_jsxs("div", { className: "flex flex-row justify-between items-center gap-4", children: [_jsx(Struct.Input, { placeholder: "Pesquisar...", className: "max-w-xs", value: search, onChange: (e) => setSearch(e.target.value) }), _jsx(Struct.Button, { asChild: true, className: "w-fit", children: _jsx(Link, { href: pathname + "/register", children: "Adicionar Novo" }) })] }));
}
