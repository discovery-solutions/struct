"use client";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { SearchHeader } from "./search-header";
import { usePathname } from "next/navigation";
import { fetcher, cn } from "../utils";
import { useStructUI } from "../provider";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export interface ListViewProps<T> {
  renderItem: (item: T, index: number) => ReactNode
  keyExtractor?: (item: T, index: number) => string | number
  ListHeaderComponent?: ReactNode
  ListEmptyComponent?: ReactNode
  ListFooterComponent?: ReactNode
  ItemSeparatorComponent?: ReactNode
  refetchOnMount?: boolean;
  endpoint?: string;
  className?: string;
  containerClassName?: string;
  title?: string;
  showNewButton?: boolean;
  data?: T[];
  queryParams?: any;
  asChild?: boolean;
  filters?: { search?: string };
  hideContent?: boolean;
  LeftSideHeaderComponent?: ReactNode;
  RightSideHeaderComponent?: ReactNode;
}

export function ListView<T>({
  data,
  endpoint,
  filters,
  queryParams,
  asChild,
  className,
  containerClassName,
  renderItem,
  keyExtractor,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  ItemSeparatorComponent,
  refetchOnMount = true,
}: ListViewProps<T>) {
  const Struct = useStructUI();
  const [search, setSearch] = useState("");
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useQuery<T[]>({
    enabled: !!endpoint,
    queryKey: [endpoint, "list", Object.values(queryParams || {})],
    queryFn: () => fetcher(`/api/${endpoint}`, { params: queryParams }) as any,
    refetchOnWindowFocus: refetchOnMount,
  });

  const listData = useMemo(() => {
    const arr = (data ?? queryData ?? []);
    return (filters?.search?.length || search.length)
      ? (arr as any[]).filter((item) => JSON.stringify(item).toLowerCase().includes((filters?.search || search).toLowerCase()))
      : arr;
  }, [data, queryData, search, filters]);

  const isEmpty = !listData || listData.length === 0;

  return (
    <div className={cn("flex flex-1 flex-col p-4 gap-4", className)}>
      {ListHeaderComponent ? ListHeaderComponent : (
        <SearchHeader
          asChild={asChild}
          search={search}
          onChange={({ target }) => setSearch(target.value)}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Struct.Loader />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-2 py-4">
          <p className="text-center text-destructive">Erro ao carregar dados.</p>
          <Struct.Button variant="outline" onClick={() => refetch()}>Tentar novamente</Struct.Button>
        </div>
      ) : isEmpty ? (
        ListEmptyComponent || <p className="text-center text-muted-foreground">Nenhum item encontrado.</p>
      ) : (
        <div className={cn("flex flex-row flex-wrap gap-4", containerClassName)}>
          {listData.map((item, index) => (
            <div key={keyExtractor?.(item, index) ?? index}>
              {renderItem(item, index)}
              {ItemSeparatorComponent && index < listData.length - 1 && ItemSeparatorComponent}
            </div>
          ))}
        </div>
      )}

      {ListFooterComponent}
    </div>
  )
}

export function ListViewHeader({ onChange }: { onChange: (value: string) => any }) {
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const Struct = useStructUI();

  useEffect(() => {
    if (onChange) onChange(search);
  }, [search, onChange]);

  return (
    <div className="flex flex-row justify-between items-center gap-4">
      <Struct.Input
        placeholder="Pesquisar..."
        className="max-w-xs"
        value={search}
        onChange={(e: any) => setSearch(e.target.value)}
      />
      <Struct.Button as={Link} href={pathname + "/register"} className="w-fit">
        Adicionar Novo
      </Struct.Button>
    </div>
  );
};