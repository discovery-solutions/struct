import { ReactNode } from "react";
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
}
export declare function ListView<T>({ data, endpoint, filters, queryParams, asChild, className, containerClassName, renderItem, keyExtractor, ListEmptyComponent, ListHeaderComponent, ListFooterComponent, ItemSeparatorComponent, refetchOnMount, }: ListViewProps<T>): import("react/jsx-runtime").JSX.Element;
export declare function ListViewHeader({ onChange }: {
    onChange: (value: string) => any;
}): import("react/jsx-runtime").JSX.Element;
