import { ReactNode } from "react";
export interface PaginatedResponse<T> {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    data: T[];
}
export interface ListViewProps<T> {
    renderItem: (item: T, index: number) => ReactNode;
    keyExtractor?: (item: T, index: number) => string | number;
    ListHeaderComponent?: ReactNode;
    ListEmptyComponent?: ReactNode;
    ListFooterComponent?: ReactNode;
    ItemSeparatorComponent?: ReactNode;
    refetchOnMount?: boolean;
    endpoint?: string;
    className?: string;
    containerClassName?: string;
    title?: string;
    showNewButton?: boolean;
    data?: T[];
    queryParams?: any;
    asChild?: boolean;
    filters?: {
        search?: string;
    };
    hideContent?: boolean;
    LeftSideHeaderComponent?: ReactNode;
    RightSideHeaderComponent?: ReactNode;
    enablePagination?: boolean;
    pageSize?: number;
    hideAdd?: boolean;
}
export declare function ListView<T>({ data, endpoint, filters, queryParams, asChild, className, containerClassName, renderItem, keyExtractor, ListEmptyComponent, ListHeaderComponent, ListFooterComponent, ItemSeparatorComponent, refetchOnMount, showNewButton, enablePagination, pageSize, hideAdd, }: ListViewProps<T>): import("react/jsx-runtime").JSX.Element;
export declare function ListViewHeader({ onChange, hideAdd }: {
    onChange: (value: string) => any;
    hideAdd: boolean;
}): import("react/jsx-runtime").JSX.Element;
