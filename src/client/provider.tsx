"use client";
import React, { createContext, useContext } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { StructUIConfig } from "./types";

const StructUIContext = createContext<StructUIConfig | null>(null);

export function StructUIProvider({
  children,
  config,
}: {
  children: React.ReactNode;
  config: StructUIConfig;
}) {
  return (
    <QueryClientProvider client={config.queryClient}>
      <StructUIContext.Provider value={config}>
        {children}
      </StructUIContext.Provider>
    </QueryClientProvider>
  );
}

export function useStructUI() {
  const ctx = useContext(StructUIContext);
  if (!ctx) throw new Error("StructUIProvider não foi configurado");
  return ctx;
}
