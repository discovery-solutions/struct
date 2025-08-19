import React from "react";
import { StructUIConfig } from "./types";
export declare function StructUIProvider({ children, config, }: {
    children: React.ReactNode;
    config: StructUIConfig;
}): import("react/jsx-runtime").JSX.Element;
export declare function useStructUI(): StructUIConfig;
