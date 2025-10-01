"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchHeader = SearchHeader;
const jsx_runtime_1 = require("react/jsx-runtime");
const modal_1 = require("./form/modal");
const provider_1 = require("../provider");
const navigation_1 = require("next/navigation");
const link_1 = __importDefault(require("next/link"));
function SearchHeader({ asChild, search, onChange, LeftItems, modalId, hideAdd = false }) {
    const { openModal } = (0, modal_1.useModalForm)();
    const pathname = (0, navigation_1.usePathname)();
    const Struct = (0, provider_1.useStructUI)();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-row justify-between items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex w-full flex-row items-center gap-4", children: [(0, jsx_runtime_1.jsx)(Struct.Input, { placeholder: "Pesquisar...", className: "max-w-xs", value: search, onChange: onChange }), LeftItems] }), (hideAdd) ? (null) : asChild ? ((0, jsx_runtime_1.jsx)(Struct.Button, { onClick: () => openModal({ modalId }), className: "w-fit", children: "Adicionar Novo" })) : ((0, jsx_runtime_1.jsx)(Struct.Button, { asChild: true, className: "w-fit", children: (0, jsx_runtime_1.jsx)(link_1.default, { href: pathname + "/register", children: "Adicionar Novo" }) }))] }));
}
