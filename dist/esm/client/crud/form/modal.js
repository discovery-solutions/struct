"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
import { useStructUI } from "../../provider";
import { ModelForm } from "./";
const ModalFormContext = createContext(null);
export function useModalForm() {
    const context = useContext(ModalFormContext);
    return (context || {
        closeModal: () => null,
        openModal: () => null,
        open: false,
    });
}
export function ModalFormProvider({ children }) {
    const [open, setOpen] = useState(false);
    const [id, setId] = useState();
    const [modalId, setModalId] = useState();
    const [defaultValues, setDefaultValues] = useState();
    const openModal = (options) => {
        setId(options?.id);
        setModalId(options?.modalId);
        setDefaultValues(options?.defaultValues);
        setOpen(true);
    };
    const closeModal = () => {
        setOpen(false);
        setId(undefined);
        setModalId(undefined);
        setDefaultValues(undefined);
    };
    return (_jsx(ModalFormContext.Provider, { value: { open, id, modalId, openModal, closeModal, defaultValues }, children: children }));
}
export function ModalForm({ modalId: thisModalId, title, fields, schema, endpoint, parseFetchedData, mutationParams, buttonLabel = false, onSuccess, cols, }) {
    const { id, open, modalId, closeModal, defaultValues } = useModalForm();
    const Struct = useStructUI();
    if (!endpoint)
        return null;
    const isOpen = open && (modalId === thisModalId || !modalId);
    return (_jsx(Struct.Dialog.Root, { open: isOpen, onOpenChange: closeModal, children: _jsxs(Struct.Dialog.Content, { className: "sm:w-[95%] sm:max-w-3xl max-h-[95%] overflow-y-auto", children: [_jsx(Struct.Dialog.Header, { children: _jsx(Struct.Dialog.Title, { children: title || (id ? "Editar" : "Novo") }) }), _jsx(ModelForm, { mode: id ? "edit" : "register", endpoint: endpoint, id: id, schema: schema, fields: fields, mutationParams: mutationParams, parseFetchedData: parseFetchedData, buttonLabel: buttonLabel, cols: cols, defaultValues: defaultValues, redirectAfterRegister: false, onAfterSubmit: (response) => {
                        closeModal();
                        onSuccess?.(response);
                    } })] }) }));
}
