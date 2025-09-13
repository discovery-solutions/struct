import { ReactNode } from "react";
export type TableViewProps = {
    columns: any[];
    endpoint: string;
    hideAdd?: boolean;
    asChild?: boolean;
    modalId?: string;
    queryParams?: Record<string, any>;
    LeftItems?: ((data: any) => ReactNode) | ReactNode;
    ListHeaderComponent?: ReactNode;
    ListEmptyComponent?: ReactNode;
    ListFooterComponent?: ReactNode;
};
export declare function TableView({ columns, asChild, modalId, hideAdd, endpoint, queryParams, LeftItems, ListEmptyComponent, ListFooterComponent, ListHeaderComponent, }: TableViewProps): import("react/jsx-runtime").JSX.Element;
