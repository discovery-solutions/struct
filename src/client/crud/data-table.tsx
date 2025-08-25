"use client";
import { useStructUI } from "../provider";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "../utils";
import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";

export interface DataTableProps {
  columns: ColumnDef<any>[];
  data: any[];
  className?: string;
  emptyText?: string;
}

export function DataTable({ columns, data, className, emptyText = "Nenhum resultado encontrado." }: DataTableProps) {
  const Struct = useStructUI();
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // 👈 necessário para sort
  });

  return (
    <div className={cn("rounded-md border overflow-hidden", className)}>
      <Struct.Table.Root>
        <Struct.Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Struct.Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Struct.Table.Head
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer select-none"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </Struct.Table.Head>
              ))}
            </Struct.Table.Row>
          ))}
        </Struct.Table.Header>

        <Struct.Table.Body>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <Struct.Table.Row key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <Struct.Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Struct.Table.Cell>
                ))}
              </Struct.Table.Row>
            ))
          ) : (
            <Struct.Table.Row>
              <Struct.Table.Cell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                {emptyText}
              </Struct.Table.Cell>
            </Struct.Table.Row>
          )}
        </Struct.Table.Body>
      </Struct.Table.Root>
    </div>
  );
}

export const getLinkTo = (acessor: string) => {
  return (props: any) => <LinkTo {...props} acessor={acessor} />;
}

export const LinkTo = ({ row, acessor }: { row: any, acessor: string }) => {
  const pathname = usePathname();
  return (
    <Link href={[pathname, row.original._id].join("/")} className="text-blue-600 hover:underline">
      {row.getValue(acessor)}
    </Link>
  );
}