import { ReactNode } from "react";
export interface ListViewProps<T> {
    renderItem: (item: T, index: number) => ReactNode;
    keyExtractor?: (item: T, index: number) => string | number;
    ListItemWrapper?: React.ComponentType<{
        children: ReactNode;
        [key: string]: any;
    }>;
    ListEmptyComponent?: ReactNode;
    ListFooterComponent?: ReactNode;
    ListHeaderComponent?: ReactNode;
    ItemSeparatorComponent?: ReactNode;
    refetchOnMount?: boolean;
    endpoint?: string;
    className?: string;
    containerClassName?: string;
    title?: string;
    data?: T[];
    queryParams?: any;
    asChild?: boolean;
    filters?: {
        search?: string;
    };
    hideContent?: boolean;
    enablePagination?: boolean;
    pageSize?: number;
    hideAdd?: boolean;
}
export declare function ListView<T>({ data, endpoint, filters, queryParams, asChild, className, containerClassName, renderItem, keyExtractor, ListItemWrapper, ListEmptyComponent, ListHeaderComponent, ListFooterComponent, ItemSeparatorComponent, refetchOnMount, enablePagination, pageSize, hideAdd, }: ListViewProps<T>): import("react/jsx-runtime").JSX.Element;
