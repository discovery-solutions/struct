"use client";
import { ReactNode, useState, forwardRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useStructUI } from "./provider";
import { fetcher } from "../fetcher";

export type ConfirmDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string | ReactNode;
  endpoint?: string;
  params?: { id: string };
  method?: "DELETE" | "PATCH" | "POST";
  onSuccess?: () => void;
  onPress?: () => void;
  onError?: (error: any) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  children?: ReactNode; // trigger custom element
}

export const ConfirmDialog = forwardRef<HTMLDivElement, ConfirmDialogProps>(({
  open: propOpen,
  onOpenChange: propOnOpenChange,
  title = "Tem certeza que deseja continuar?",
  description = "Essa ação é irreversível.",
  endpoint,
  params,
  method = "DELETE",
  onSuccess,
  onPress,
  onError,
  variant = "destructive",
  children,
}, ref) => {
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
    onError: (err: any) => {
      Struct.toast.error(err.message || "Erro ao executar a ação");
      console.error(err);
      onError?.(err);
      onOpenChange(false);
    },
  });

  return (
    <Struct.Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children && (
        <Struct.Dialog.Trigger asChild>
          {children}
        </Struct.Dialog.Trigger>
      )}

      <Struct.Dialog.Content ref={ref} className="sm:max-w-[425px]">
        <Struct.Dialog.Header>
          <Struct.Dialog.Title>{title}</Struct.Dialog.Title>
          <Struct.Dialog.Description>{description}</Struct.Dialog.Description>
        </Struct.Dialog.Header>
        <Struct.Dialog.Footer>
          <Struct.Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Struct.Button>
          <Struct.Button
            variant={variant}
            onClick={onPress || (() => mutation.mutate())}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Struct.Loader className="w-4 h-4" />
            ) : (
              "Confirmar"
            )}
          </Struct.Button>
        </Struct.Dialog.Footer>
      </Struct.Dialog.Content>
    </Struct.Dialog.Root>
  );
});

ConfirmDialog.displayName = "ConfirmDialog";

// Hook helper
export const useConfirmDialog = () => {
  const [open, setOpen] = useState(false);
  const trigger = () => setOpen(true);
  return { open, setOpen, trigger };
};