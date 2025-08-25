"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useStructUI } from "../provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../utils";

export interface DataTableProps {
  columns: ColumnDef<any>[];
  data: any[];
  className?: string;
  emptyText?: string;
}

export function DataTable({ columns, data, className, emptyText = "Nenhum resultado encontrado." }: DataTableProps) {
  const Struct = useStructUI();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={cn("rounded-md border overflow-hidden", className)}>
      <Struct.Table.Root>
        <Struct.Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Struct.Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Struct.Table.Head key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </Struct.Table.Head>
              ))}
            </Struct.Table.Row>
          ))}
        </Struct.Table.Header>

        <Struct.Table.Body>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <Struct.Table.Row
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
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