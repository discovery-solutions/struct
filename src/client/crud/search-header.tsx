"use client";
import { useModalForm } from "./form/modal";
import { useStructUI } from "../provider";
import { usePathname } from "next/navigation";
import { cn } from "../utils";
import Link from "next/link";

export function SearchHeader({ asChild, search, onChange, LeftItems, modalId, hideAdd = false, className }: { hideAdd?: boolean, asChild?: boolean; search?: string, onChange: (e: any) => any, LeftItems?: any, modalId?: string, className?: string }) {
  const { openModal } = useModalForm();
  const pathname = usePathname();
  const Struct = useStructUI();

  return (
    <div className={cn("flex flex-row justify-between items-center gap-4", className)}>
      <div className="flex w-full flex-row items-center gap-4">
        <Struct.Input
          placeholder="Pesquisar..."
          className="w-full md:max-w-xs"
          value={search}
          onChange={onChange}
        />
        {LeftItems}
      </div>
      {(hideAdd) ? (null) : asChild ? (
        <Struct.Button onClick={() => openModal({ modalId })} className="w-full md:w-fit">
          Adicionar Novo
        </Struct.Button>
      ) : (
        <Struct.Button asChild className="w-full md:w-fit">
          <Link href={pathname + "/register"}>
            Adicionar Novo
          </Link>
        </Struct.Button>
      )}
    </div>
  );
}