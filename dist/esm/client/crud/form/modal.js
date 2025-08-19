"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
import { useStructUI } from "../../provider";
import { ModelForm } from "./";
const ModalFormContext = createContext(null);
export function useModalForm() {
    const context = useContext(ModalFormContext);
    return context || { closeModal: () => null, openModal: () => null, open: false };
}
export function ModalFormProvider({ children }) {
    const [open, setOpen] = useState(false);
    const [id, setId] = useState();
    const openModal = (options) => {
        setId(options?.id);
        setOpen(true);
    };
    const closeModal = () => {
        setOpen(false);
        setId(undefined);
    };
    return (_jsx(ModalFormContext.Provider, { value: { open, id, openModal, closeModal }, children: children }));
}
export function ModalForm({ title, fields, schema, endpoint, parseFetchedData, mutationParams, buttonLabel = false, onSuccess, cols, }) {
    const { id, open, closeModal } = useModalForm();
    const Struct = useStructUI();
    if (!endpoint)
        return null;
    return (_jsx(Struct.Dialog.Root, { open: open, onOpenChange: closeModal, children: _jsxs(Struct.Dialog.Content, { className: "sm:w-[95%] sm:max-w-3xl max-h-[95%] overflow-y-auto", children: [_jsx(Struct.Dialog.Header, { children: _jsx(Struct.Dialog.Title, { children: title || (id ? "Editar" : "Novo") }) }), _jsx(ModelForm, { mode: id ? "edit" : "register", endpoint: endpoint, id: id, schema: schema, fields: fields, mutationParams: mutationParams, parseFetchedData: parseFetchedData, buttonLabel: buttonLabel, cols: cols, redirectAfterRegister: false, onAfterSubmit: (response) => {
                        closeModal();
                        onSuccess?.(response);
                    } })] }) }));
}
