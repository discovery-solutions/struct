"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useStructUI } from "../../provider";
import { ModelForm } from "./";
import { z } from "zod";
import { FieldInterface } from "../../types";

type ModalFormState = {
  id?: string;
  open: boolean;
  openModal: (options?: { id?: string }) => void;
  closeModal: () => void;
};

const ModalFormContext = createContext<ModalFormState | null>(null);

export function useModalForm() {
  const context = useContext(ModalFormContext);
  return context || { closeModal: () => null, openModal: () => null, open: false };
}

export function ModalFormProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string | undefined>();

  const openModal = (options?: { id?: string }) => {
    setId(options?.id);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setId(undefined);
  };

  return (
    <ModalFormContext.Provider value={{ open, id, openModal, closeModal }}>
      {children}
    </ModalFormContext.Provider>
  );
}

export interface ModalFormProps {
  id?: string,
  title?: string,
  endpoint: string,
  fields: FieldInterface[];
  schema: z.ZodSchema<any>;
  parseFetchedData?: (data: any) => Promise<any>;
  mutationParams?: Record<string, any>;
  buttonLabel?: string | boolean;
  onSuccess?: (response: any) => any;
  cols?: number;
}

export function ModalForm({
  title,
  fields,
  schema,
  endpoint,
  parseFetchedData,
  mutationParams,
  buttonLabel = false,
  onSuccess,
  cols,
}: ModalFormProps) {
  const { id, open, closeModal } = useModalForm();
  const Struct = useStructUI();

  if (!endpoint) return null;

  return (
    <Struct.Dialog.Root open={open} onOpenChange={closeModal}>
      <Struct.Dialog.Content className="sm:w-[95%] sm:max-w-3xl max-h-[95%] overflow-y-auto">
        <Struct.Dialog.Header>
          <Struct.Dialog.Title>{title || (id ? "Editar" : "Novo")}</Struct.Dialog.Title>
        </Struct.Dialog.Header>
        <ModelForm
          mode={id ? "edit" : "register"}
          endpoint={endpoint}
          id={id}
          schema={schema}
          fields={fields}
          mutationParams={mutationParams}
          parseFetchedData={parseFetchedData}
          buttonLabel={buttonLabel}
          cols={cols}
          redirectAfterRegister={false}
          onAfterSubmit={(response) => {
            closeModal();
            onSuccess?.(response);
          }}
        />
      </Struct.Dialog.Content>
    </Struct.Dialog.Root>
  );
}
