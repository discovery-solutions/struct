"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModalForm = useModalForm;
exports.ModalFormProvider = ModalFormProvider;
exports.ModalForm = ModalForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const provider_1 = require("../../provider");
const _1 = require("./");
const ModalFormContext = (0, react_1.createContext)(null);
function useModalForm() {
    const context = (0, react_1.useContext)(ModalFormContext);
    return context || { closeModal: () => null, openModal: () => null, open: false };
}
function ModalFormProvider({ children }) {
    const [open, setOpen] = (0, react_1.useState)(false);
    const [id, setId] = (0, react_1.useState)();
    const openModal = (options) => {
        setId(options?.id);
        setOpen(true);
    };
    const closeModal = () => {
        setOpen(false);
        setId(undefined);
    };
    return ((0, jsx_runtime_1.jsx)(ModalFormContext.Provider, { value: { open, id, openModal, closeModal }, children: children }));
}
function ModalForm({ title, modelName, fields, schema, parseFetchedData, mutationParams, buttonLabel = false, onSuccess, cols, }) {
    const { id, open, closeModal } = useModalForm();
    const Struct = (0, provider_1.useStructUI)();
    if (!modelName)
        return null;
    return ((0, jsx_runtime_1.jsx)(Struct.Dialog.Root, { open: open, onOpenChange: closeModal, children: (0, jsx_runtime_1.jsxs)(Struct.Dialog.Content, { className: "sm:w-[95%] sm:max-w-3xl max-h-[95%] overflow-y-auto", children: [(0, jsx_runtime_1.jsx)(Struct.Dialog.Header, { children: (0, jsx_runtime_1.jsx)(Struct.Dialog.Title, { children: title || (id ? "Editar" : "Novo") }) }), (0, jsx_runtime_1.jsx)(_1.ModelForm, { mode: id ? "edit" : "register", modelName: modelName, id: id, schema: schema, fields: fields, mutationParams: mutationParams, parseFetchedData: parseFetchedData, buttonLabel: buttonLabel, cols: cols, redirectAfterRegister: false, onAfterSubmit: (response) => {
                        closeModal();
                        onSuccess?.(response);
                    } })] }) }));
}
