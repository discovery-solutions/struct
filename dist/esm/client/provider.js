"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
const StructUIContext = createContext(null);
export function StructUIProvider({ children, config, }) {
    return (_jsx(QueryClientProvider, { client: config.queryClient, children: _jsx(StructUIContext.Provider, { value: config, children: children }) }));
}
export function useStructUI() {
    const ctx = useContext(StructUIContext);
    if (!ctx)
        throw new Error("StructUIProvider não foi configurado");
    return ctx;
}
