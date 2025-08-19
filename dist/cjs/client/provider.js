"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructUIProvider = StructUIProvider;
exports.useStructUI = useStructUI;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const StructUIContext = (0, react_1.createContext)(null);
function StructUIProvider({ children, config, }) {
    return ((0, jsx_runtime_1.jsx)(StructUIContext.Provider, { value: config, children: children }));
}
function useStructUI() {
    const ctx = (0, react_1.useContext)(StructUIContext);
    if (!ctx)
        throw new Error("StructUIProvider não foi configurado");
    return ctx;
}
