"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkTo = exports.getLinkTo = void 0;
exports.DataTable = DataTable;
const jsx_runtime_1 = require("react/jsx-runtime");
const provider_1 = require("../provider");
const navigation_1 = require("next/navigation");
const react_1 = require("react");
const utils_1 = require("../utils");
const link_1 = __importDefault(require("next/link"));
const react_table_1 = require("@tanstack/react-table");
const lucide_react_1 = require("lucide-react");
function DataTable({ columns, data, className, emptyText = "Nenhum resultado encontrado." }) {
    const Struct = (0, provider_1.useStructUI)();
    const [sorting, setSorting] = (0, react_1.useState)([]);
    const table = (0, react_table_1.useReactTable)({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: (0, react_table_1.getCoreRowModel)(),
        getSortedRowModel: (0, react_table_1.getSortedRowModel)(), // 👈 necessário para sort
    });
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("rounded-md border overflow-hidden", className), children: (0, jsx_runtime_1.jsxs)(Struct.Table.Root, { children: [(0, jsx_runtime_1.jsx)(Struct.Table.Header, { children: table.getHeaderGroups().map((headerGroup) => ((0, jsx_runtime_1.jsx)(Struct.Table.Row, { children: headerGroup.headers.map((header) => ((0, jsx_runtime_1.jsxs)(Struct.Table.Head, { onClick: header.column.getToggleSortingHandler(), className: "cursor-pointer select-none", children: [(0, react_table_1.flexRender)(header.column.columnDef.header, header.getContext()), header.column.getIsSorted() === "asc" ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ArrowDown, { className: "ml-2 inline h-4 w-4" })) : header.column.getIsSorted() === "desc" ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ArrowUp, { className: "ml-2 inline h-4 w-4" })) : null] }, header.id))) }, headerGroup.id))) }), (0, jsx_runtime_1.jsx)(Struct.Table.Body, { children: table.getRowModel().rows.length ? (table.getRowModel().rows.map((row) => ((0, jsx_runtime_1.jsx)(Struct.Table.Row, { "data-state": row.getIsSelected() && "selected", children: row.getVisibleCells().map((cell) => ((0, jsx_runtime_1.jsx)(Struct.Table.Cell, { children: (0, react_table_1.flexRender)(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id)))) : ((0, jsx_runtime_1.jsx)(Struct.Table.Row, { children: (0, jsx_runtime_1.jsx)(Struct.Table.Cell, { colSpan: columns.length, className: "h-24 text-center text-muted-foreground", children: emptyText }) })) })] }) }));
}
const getLinkTo = (acessor) => {
    return (props) => (0, jsx_runtime_1.jsx)(exports.LinkTo, { ...props, acessor: acessor });
};
exports.getLinkTo = getLinkTo;
const LinkTo = ({ row, acessor }) => {
    const pathname = (0, navigation_1.usePathname)();
    return ((0, jsx_runtime_1.jsx)(link_1.default, { href: [pathname, row.original._id].join("/"), className: "text-blue-600 hover:underline", children: row.getValue(acessor) }));
};
exports.LinkTo = LinkTo;
