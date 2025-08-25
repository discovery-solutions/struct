"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { flexRender, getCoreRowModel, useReactTable, } from "@tanstack/react-table";
import { useStructUI } from "../provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../utils";
export function DataTable({ columns, data, className, emptyText = "Nenhum resultado encontrado." }) {
    const Struct = useStructUI();
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    return (_jsx("div", { className: cn("rounded-md border overflow-hidden", className), children: _jsxs(Struct.Table.Root, { children: [_jsx(Struct.Table.Header, { children: table.getHeaderGroups().map((headerGroup) => (_jsx(Struct.Table.Row, { children: headerGroup.headers.map((header) => (_jsx(Struct.Table.Head, { children: header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext()) }, header.id))) }, headerGroup.id))) }), _jsx(Struct.Table.Body, { children: table.getRowModel().rows.length ? (table.getRowModel().rows.map((row) => (_jsx(Struct.Table.Row, { "data-state": row.getIsSelected() && "selected", children: row.getVisibleCells().map((cell) => (_jsx(Struct.Table.Cell, { children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id)))) : (_jsx(Struct.Table.Row, { children: _jsx(Struct.Table.Cell, { colSpan: columns.length, className: "h-24 text-center text-muted-foreground", children: emptyText }) })) })] }) }));
}
export const getLinkTo = (acessor) => {
    return (props) => _jsx(LinkTo, { ...props, acessor: acessor });
};
export const LinkTo = ({ row, acessor }) => {
    const pathname = usePathname();
    return (_jsx(Link, { href: [pathname, row.original._id].join("/"), className: "text-blue-600 hover:underline", children: row.getValue(acessor) }));
};
