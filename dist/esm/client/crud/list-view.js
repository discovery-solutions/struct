"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { SearchHeader } from "./search-header";
import { usePathname } from "next/navigation";
import { fetcher, cn } from "../utils";
import { useStructUI } from "../provider";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
export function ListView({ data, endpoint, filters, queryParams, asChild, className, containerClassName, renderItem, keyExtractor, ListEmptyComponent, ListHeaderComponent, ListFooterComponent, ItemSeparatorComponent, refetchOnMount = true, }) {
    const Struct = useStructUI();
    const [search, setSearch] = useState("");
    const { data: queryData, isLoading, error, refetch, } = useQuery({
        enabled: !!endpoint,
        queryKey: [endpoint, "list", Object.values(queryParams || {})],
        queryFn: () => fetcher(`/api/${endpoint}`, { params: queryParams }),
        refetchOnWindowFocus: refetchOnMount,
    });
    const listData = useMemo(() => {
        const arr = (data ?? queryData ?? []);
        return (filters?.search?.length || search.length)
            ? arr.filter((item) => JSON.stringify(item).toLowerCase().includes((filters?.search || search).toLowerCase()))
            : arr;
    }, [data, queryData, search, filters]);
    const isEmpty = !listData || listData.length === 0;
    return (_jsxs("div", { className: cn("flex flex-1 flex-col p-4 gap-4", className), children: [ListHeaderComponent ? ListHeaderComponent : (_jsx(SearchHeader, { asChild: asChild, search: search, onChange: ({ target }) => setSearch(target.value) })), isLoading ? (_jsx("div", { className: "flex justify-center py-4", children: _jsx(Struct.Loader, {}) })) : error ? (_jsxs("div", { className: "flex flex-col items-center gap-2 py-4", children: [_jsx("p", { className: "text-center text-destructive", children: "Erro ao carregar dados." }), _jsx(Struct.Button, { variant: "outline", onClick: () => refetch(), children: "Tentar novamente" })] })) : isEmpty ? (ListEmptyComponent || _jsx("p", { className: "text-center text-muted-foreground", children: "Nenhum item encontrado." })) : (_jsx("div", { className: cn("flex flex-row flex-wrap gap-4", containerClassName), children: listData.map((item, index) => (_jsxs("div", { children: [renderItem(item, index), ItemSeparatorComponent && index < listData.length - 1 && ItemSeparatorComponent] }, keyExtractor?.(item, index) ?? index))) })), ListFooterComponent] }));
}
export function ListViewHeader({ onChange }) {
    const [search, setSearch] = useState("");
    const pathname = usePathname();
    const Struct = useStructUI();
    useEffect(() => {
        if (onChange)
            onChange(search);
    }, [search, onChange]);
    return (_jsxs("div", { className: "flex flex-row justify-between items-center gap-4", children: [_jsx(Struct.Input, { placeholder: "Pesquisar...", className: "max-w-xs", value: search, onChange: (e) => setSearch(e.target.value) }), _jsx(Struct.Button, { as: Link, href: pathname + "/register", className: "w-fit", children: "Adicionar Novo" })] }));
}
;
