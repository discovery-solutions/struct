"use client";
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useStructUI } from "../provider";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "../utils";
import Link from "next/link";
import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel, } from "@tanstack/react-table";
export function DataTable({ columns, data, className, emptyText = "Nenhum resultado encontrado." }) {
    const Struct = useStructUI();
    const [sorting, setSorting] = useState([]);
    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(), // 👈 necessário para sort
    });
    return (_jsx("div", { className: cn("rounded-md border overflow-hidden", className), children: _jsxs(Struct.Table.Root, { children: [_jsx(Struct.Table.Header, { children: table.getHeaderGroups().map((headerGroup) => (_jsx(Struct.Table.Row, { children: headerGroup.headers.map((header) => (_jsxs(Struct.Table.Head, { onClick: header.column.getToggleSortingHandler(), className: "cursor-pointer select-none", children: [flexRender(header.column.columnDef.header, header.getContext()), {
                                    asc: " 🔼",
                                    desc: " 🔽",
                                }[header.column.getIsSorted()] ?? null] }, header.id))) }, headerGroup.id))) }), _jsx(Struct.Table.Body, { children: table.getRowModel().rows.length ? (table.getRowModel().rows.map((row) => (_jsx(Struct.Table.Row, { "data-state": row.getIsSelected() && "selected", children: row.getVisibleCells().map((cell) => (_jsx(Struct.Table.Cell, { children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id)))) : (_jsx(Struct.Table.Row, { children: _jsx(Struct.Table.Cell, { colSpan: columns.length, className: "h-24 text-center text-muted-foreground", children: emptyText }) })) })] }) }));
}
export const getLinkTo = (acessor) => {
    return (props) => _jsx(LinkTo, { ...props, acessor: acessor });
};
export const LinkTo = ({ row, acessor }) => {
    const pathname = usePathname();
    return (_jsx(Link, { href: [pathname, row.original._id].join("/"), className: "text-blue-600 hover:underline", children: row.getValue(acessor) }));
};
