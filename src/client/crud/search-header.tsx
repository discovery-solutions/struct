"use client";
import { useModalForm } from "./form/modal";
import { useStructUI } from "../provider";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";

export function SearchHeader({ asChild, search, onChange, LeftItems, modalId, hideAdd = false }: { hideAdd?: boolean, asChild?: boolean; search?: string, onChange: (e: any) => any, LeftItems?: any, modalId?: string }) {
  const { openModal } = useModalForm();
  const pathname = usePathname();
  const Struct = useStructUI();

  return (
    <div className="flex flex-row justify-between items-center gap-4">
      <div className="flex w-full flex-row items-center gap-4">
        <Struct.Input
          placeholder="Pesquisar..."
          className="max-w-xs"
          value={search}
          onChange={onChange}
        />
        {LeftItems}
      </div>
      {(hideAdd) ? (null) : asChild ? (
        <Struct.Button onClick={() => openModal({ modalId })} className="w-fit">
          Adicionar Novo
        </Struct.Button>
      ) : (
        <Struct.Button asChild className="w-fit">
          <Link href={pathname + "/register"}>
            Adicionar Novo
          </Link>
        </Struct.Button>
      )}
    </div>
  );
}