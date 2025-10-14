"use client";
import { clsx, type ClassValue } from "clsx";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toLink = (text: string | ReactNode, href: string, props?: any) => {
  return <Link className="hover:underline" href={href} {...props}> {text} </Link>
}