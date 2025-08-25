"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useModalForm } from "./form/modal";
import { useStructUI } from "../provider";
import { usePathname } from "next/navigation";
import Link from "next/link";
export function SearchHeader({ asChild, search, onChange, LeftItems, modalId, hideAdd = false }) {
    const { openModal } = useModalForm();
    const pathname = usePathname();
    const Struct = useStructUI();
    return (_jsxs("div", { className: "flex flex-row justify-between items-center gap-4", children: [_jsxs("div", { className: "flex w-full flex-row items-center gap-4", children: [_jsx(Struct.Input, { placeholder: "Pesquisar...", className: "max-w-xs", value: search, onChange: onChange }), LeftItems] }), (hideAdd) ? (null) : asChild ? (_jsx(Struct.Button, { onClick: () => openModal({ modalId }), className: "w-fit", children: "Adicionar Novo" })) : (_jsx(Struct.Button, { as: Link, href: pathname + "/register", className: "w-fit", children: "Adicionar Novo" }))] }));
}
