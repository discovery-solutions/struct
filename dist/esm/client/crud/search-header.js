"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useModalForm } from "./form/modal";
import { useStructUI } from "../provider";
import { usePathname } from "next/navigation";
import { cn } from "../utils";
import Link from "next/link";
export function SearchHeader({ asChild, search, onChange, LeftItems, modalId, hideAdd = false, className }) {
    const { openModal } = useModalForm();
    const pathname = usePathname();
    const Struct = useStructUI();
    return (_jsxs("div", { className: cn("flex flex-row justify-between items-center gap-4", className), children: [_jsxs("div", { className: "flex w-full flex-row items-center gap-4", children: [_jsx(Struct.Input, { placeholder: "Pesquisar...", className: "max-w-xs", value: search, onChange: onChange }), LeftItems] }), (hideAdd) ? (null) : asChild ? (_jsx(Struct.Button, { onClick: () => openModal({ modalId }), className: "w-fit", children: "Adicionar Novo" })) : (_jsx(Struct.Button, { asChild: true, className: "w-fit", children: _jsx(Link, { href: pathname + "/register", children: "Adicionar Novo" }) }))] }));
}
