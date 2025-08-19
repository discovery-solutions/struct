"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation } from "@tanstack/react-query";
import { useStructUI } from "./provider";
import { fetcher } from "./utils";
import { useState, forwardRef } from "react";
export const ConfirmDialog = forwardRef(({ open: propOpen, onOpenChange: propOnOpenChange, title = "Tem certeza que deseja continuar?", description = "Essa ação é irreversível.", endpoint, params, method = "DELETE", onSuccess, onPress, onError, variant = "destructive", children, }, ref) => {
    const { queryClient, ...Struct } = useStructUI();
    const [internalOpen, setInternalOpen] = useState(false);
    const open = propOpen ?? internalOpen;
    const onOpenChange = propOnOpenChange ?? setInternalOpen;
    const mutation = useMutation({
        mutationFn: () => fetcher(`/api/${endpoint}/${params?.id}`, { method }),
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
    return (_jsxs(Struct.Dialog.Root, { open: open, onOpenChange: onOpenChange, children: [children && (_jsx(Struct.Dialog.Trigger, { asChild: true, children: children })), _jsxs(Struct.Dialog.Content, { ref: ref, className: "sm:max-w-[425px]", children: [_jsxs(Struct.Dialog.Header, { children: [_jsx(Struct.Dialog.Title, { children: title }), _jsx(Struct.Dialog.Description, { children: description })] }), _jsxs(Struct.Dialog.Footer, { children: [_jsx(Struct.Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancelar" }), _jsx(Struct.Button, { variant: variant, onClick: onPress || (() => mutation.mutate()), disabled: mutation.isPending, children: mutation.isPending ? (_jsx(Struct.Loader, { className: "w-4 h-4" })) : ("Confirmar") })] })] })] }));
});
ConfirmDialog.displayName = "ConfirmDialog";
// Hook helper
export const useConfirmDialog = () => {
    const [open, setOpen] = useState(false);
    const trigger = () => setOpen(true);
    return { open, setOpen, trigger };
};
