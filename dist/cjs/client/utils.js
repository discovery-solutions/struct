"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLink = void 0;
exports.cn = cn;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
const link_1 = __importDefault(require("next/link"));
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
const toLink = (text, href, props) => {
    return (0, jsx_runtime_1.jsxs)(link_1.default, { className: "hover:underline", href: href, ...props, children: [" ", text, " "] });
};
exports.toLink = toLink;
