"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useStructUI } from "../../provider";
import { ModelForm } from "./";
import { z } from "zod";
import { FieldInterface } from "../../types";

type ModalFormState = {
  id?: string;
  modalId?: string;
  open: boolean;
  openModal: (options?: { id?: string; modalId?: string; defaultValues?: any }) => void;
  closeModal: () => void;
  defaultValues?: Record<string, any>;
};

const ModalFormContext = createContext<ModalFormState | null>(null);

export function useModalForm() {
  const context = useContext(ModalFormContext);
  return (
    context || {
      closeModal: () => null,
      openModal: () => null,
      open: false,
    }
  );
}

export function ModalFormProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string | undefined>();
  const [modalId, setModalId] = useState<string | undefined>();
  const [defaultValues, setDefaultValues] = useState<Record<string, any> | undefined>();

  const openModal = (options?: { id?: string; modalId?: string; defaultValues?: any }) => {
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

  return (
    <ModalFormContext.Provider value={{ open, id, modalId, openModal, closeModal, defaultValues }}>
      {children}
    </ModalFormContext.Provider>
  );
}

export interface ModalFormProps {
  modalId?: string;
  id?: string;
  mode?: "register" | "edit";
  title?: string;
  endpoint: string;
  fields: FieldInterface[];
  schema: z.ZodSchema<any>;
  parseFetchedData?: (data: any) => Promise<any>;
  mutationParams?: Record<string, any>;
  buttonLabel?: string | boolean;
  onSuccess?: (response: any) => any;
  cols?: number;
}

export function ModalForm({
  modalId: thisModalId,
  mode: thisMode,
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
  const { id, open, modalId, closeModal, defaultValues } = useModalForm();
  const Struct = useStructUI();

  if (!endpoint) return null;

  const isOpen = open && modalId === thisModalId;
  const mode = thisMode || (id ? "edit" : "register");

  return (
    <Struct.Dialog.Root open={isOpen} onOpenChange={closeModal}>
      <Struct.Dialog.Content className="sm:w-[95%] sm:max-w-3xl max-h-[95%] overflow-y-auto">
        <Struct.Dialog.Header>
          <Struct.Dialog.Title>{title || (id ? "Editar" : "Novo")}</Struct.Dialog.Title>
        </Struct.Dialog.Header>
        <ModelForm
          mode={mode}
          endpoint={endpoint}
          id={mode === "register" ? undefined : id}
          schema={schema}
          fields={fields}
          mutationParams={mutationParams}
          parseFetchedData={parseFetchedData}
          buttonLabel={buttonLabel}
          cols={cols}
          defaultValues={defaultValues}
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
