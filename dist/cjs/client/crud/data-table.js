"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkTo = exports.getLinkTo = void 0;
exports.DataTable = DataTable;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_table_1 = require("@tanstack/react-table");
const provider_1 = require("../provider");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const utils_1 = require("../utils");
function DataTable({ columns, data, className, emptyText = "Nenhum resultado encontrado." }) {
    const Struct = (0, provider_1.useStructUI)();
    const table = (0, react_table_1.useReactTable)({
        data,
        columns,
        getCoreRowModel: (0, react_table_1.getCoreRowModel)(),
    });
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("rounded-md border overflow-hidden", className), children: (0, jsx_runtime_1.jsxs)(Struct.Table.Root, { children: [(0, jsx_runtime_1.jsx)(Struct.Table.Header, { children: table.getHeaderGroups().map((headerGroup) => ((0, jsx_runtime_1.jsx)(Struct.Table.Row, { children: headerGroup.headers.map((header) => ((0, jsx_runtime_1.jsx)(Struct.Table.Head, { children: header.isPlaceholder
                                ? null
                                : (0, react_table_1.flexRender)(header.column.columnDef.header, header.getContext()) }, header.id))) }, headerGroup.id))) }), (0, jsx_runtime_1.jsx)(Struct.Table.Body, { children: table.getRowModel().rows.length ? (table.getRowModel().rows.map((row) => ((0, jsx_runtime_1.jsx)(Struct.Table.Row, { "data-state": row.getIsSelected() && "selected", children: row.getVisibleCells().map((cell) => ((0, jsx_runtime_1.jsx)(Struct.Table.Cell, { children: (0, react_table_1.flexRender)(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id)))) : ((0, jsx_runtime_1.jsx)(Struct.Table.Row, { children: (0, jsx_runtime_1.jsx)(Struct.Table.Cell, { colSpan: columns.length, className: "h-24 text-center text-muted-foreground", children: emptyText }) })) })] }) }));
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
