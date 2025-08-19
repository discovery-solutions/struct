"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmDialog = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_query_1 = require("@tanstack/react-query");
const provider_1 = require("./provider");
const utils_1 = require("./utils");
const ConfirmDialog = ({ open, onOpenChange, title = "Tem certeza que deseja continuar?", description = "Essa ação é irreversível.", modelName, params, method = "DELETE", onSuccess, onPress, onError, variant = "destructive", }) => {
    const queryClient = (0, react_query_1.useQueryClient)();
    const Struct = (0, provider_1.useStructUI)(); // <- hook para pegar os componentes
    const mutation = (0, react_query_1.useMutation)({
        mutationFn: () => (0, utils_1.fetcher)(`/api/${modelName}/${params?.id}`, { method }),
        onSuccess: () => {
            Struct.toast.success("Ação realizada com sucesso!");
            queryClient.invalidateQueries();
            onSuccess?.();
            onOpenChange(false);
        },
        onError: (err) => {
            Struct.toast.error(err.message || "Erro ao executar a ação");
            console.error(err);
            onError?.(err);
            onOpenChange(false);
        },
    });
    return ((0, jsx_runtime_1.jsx)(Struct.Dialog.Root, { open: open, onOpenChange: onOpenChange, children: (0, jsx_runtime_1.jsxs)(Struct.Dialog.Content, { className: "sm:max-w-[425px]", children: [(0, jsx_runtime_1.jsxs)(Struct.Dialog.Header, { children: [(0, jsx_runtime_1.jsx)(Struct.Dialog.Title, { children: title }), (0, jsx_runtime_1.jsx)(Struct.Dialog.Description, { children: description })] }), (0, jsx_runtime_1.jsxs)(Struct.Dialog.Footer, { children: [(0, jsx_runtime_1.jsx)(Struct.Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancelar" }), (0, jsx_runtime_1.jsx)(Struct.Button, { variant: variant, onClick: onPress || (() => mutation.mutate()), disabled: mutation.isPending, children: mutation.isPending ? ((0, jsx_runtime_1.jsx)(Struct.Loader, { className: "w-4 h-4" })) : ("Confirmar") })] })] }) }));
};
exports.ConfirmDialog = ConfirmDialog;
