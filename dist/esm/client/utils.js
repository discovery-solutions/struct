"use client";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export const toLink = (text, href, props) => {
    return _jsxs(Link, { className: "hover:underline", href: href, ...props, children: [" ", text, " "] });
};
