import { ReactNode } from "react";
type TableViewProps = {
    columns: any[];
    endpoint: string;
    hideAdd?: boolean;
    asChild?: boolean;
    queryParams?: Record<string, any>;
    LeftItems?: ReactNode;
    ListHeaderComponent?: ReactNode;
    ListEmptyComponent?: ReactNode;
    ListFooterComponent?: ReactNode;
};
export declare function TableView({ columns, asChild, hideAdd, endpoint, queryParams, LeftItems, ListEmptyComponent, ListFooterComponent, ListHeaderComponent, }: TableViewProps): import("react/jsx-runtime").JSX.Element;
export {};
