import { ColumnDef } from "@tanstack/react-table";
export interface DataTableProps {
    columns: ColumnDef<any>[];
    data: any[];
    className?: string;
    emptyText?: string;
}
export declare function DataTable({ columns, data, className, emptyText }: DataTableProps): import("react/jsx-runtime").JSX.Element;
