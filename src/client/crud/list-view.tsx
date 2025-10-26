"use client";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { SearchHeader } from "./search-header";
import { usePathname } from "next/navigation";
import { useStructUI } from "../provider";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../fetcher";
import { cn } from "../utils";
import Link from "next/link";

export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}

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
  enablePagination?: boolean;
  pageSize?: number;
  hideAdd?: boolean;
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
  showNewButton = true,
  enablePagination = false,
  pageSize = 10,
  hideAdd = false,
}: ListViewProps<T>) {
  const Struct = useStructUI();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useQuery<T[] | PaginatedResponse<T>>({
    enabled: !!endpoint,
    queryKey: [endpoint, "list", currentPage, pageSize, Object.values(queryParams || {})],
    queryFn: () => fetcher(`/api/${endpoint}`, {
      params: {
        ...queryParams,
        ...(enablePagination ? { page: currentPage, limit: pageSize } : {})
      }
    }) as any,
    refetchOnWindowFocus: refetchOnMount,
  });

  // Detecta se a resposta é paginada ou array puro
  const isPaginatedResponse = (data: any): data is PaginatedResponse<T> => {
    return data && typeof data === 'object' && 'data' in data && 'page' in data && 'totalPages' in data;
  };

  const { items, paginationInfo } = useMemo(() => {
    let rawData: T[] = [];
    let pagination: PaginatedResponse<T> | null = null;

    if (data) {
      rawData = data;
    } else if (queryData) {
      if (isPaginatedResponse(queryData)) {
        rawData = queryData.data;
        pagination = queryData;
      } else {
        rawData = queryData as T[];
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
      ? (arr as any[]).filter((item) =>
        JSON.stringify(item).toLowerCase().includes((filters?.search || search).toLowerCase())
      )
      : arr;
  }, [items, search, filters]);

  const isEmpty = !listData || listData.length === 0;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const renderPagination = () => {
    if (!enablePagination || !paginationInfo) return null;

    const { page, totalPages, total } = paginationInfo;

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between gap-4 pt-4">
        <div className="text-sm text-muted-foreground">
          Página {page} de {totalPages} ({total} {total === 1 ? 'item' : 'itens'})
        </div>
        <div className="flex gap-2">
          <Struct.Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Anterior
          </Struct.Button>

          {/* Renderiza números de página */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number;

            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <Struct.Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Struct.Button>
            );
          })}

          <Struct.Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Próxima
          </Struct.Button>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-1 flex-col p-4 gap-4", className)}>
      {ListHeaderComponent ? ListHeaderComponent : (
        <SearchHeader
          asChild={asChild}
          search={search}
          onChange={({ target }) => setSearch(target.value)}
          hideAdd={hideAdd === false ? false : !showNewButton}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Struct.Loader />
        </div>
      ) : (error && listData.length < 1) ? (
        <div className="flex flex-col items-center gap-2 py-4">
          <p className="text-center text-destructive">Erro ao carregar dados.</p>
          <Struct.Button variant="outline" onClick={() => refetch()}>Tentar novamente</Struct.Button>
        </div>
      ) : isEmpty ? (
        ListEmptyComponent || <p className="text-center text-muted-foreground">Nenhum item encontrado.</p>
      ) : (
        <>
          <div className={cn("flex flex-row flex-wrap gap-4", containerClassName)}>
            {listData.map((item, index) => (
              <div key={keyExtractor?.(item, index) ?? index}>
                {renderItem(item, index)}
                {ItemSeparatorComponent && index < listData.length - 1 && ItemSeparatorComponent}
              </div>
            ))}
          </div>

          {renderPagination()}
        </>
      )}

      {ListFooterComponent}
    </div>
  )
}

export function ListViewHeader({ onChange, hideAdd = false }: { onChange: (value: string) => any, hideAdd: boolean }) {
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
      {(!hideAdd) && (
        <Struct.Button asChild className="w-fit">
          <Link href={pathname + "/register"}>
            Adicionar Novo
          </Link>
        </Struct.Button>
      )}
    </div>
  );
}