import { ReactNode } from "react";
import { z } from "zod";
import { FieldInterface } from "../../types";
type ModalFormState = {
    id?: string;
    modalId?: string;
    open: boolean;
    openModal: (options?: {
        id?: string;
        modalId?: string;
        defaultValues?: any;
    }) => void;
    closeModal: () => void;
    defaultValues?: Record<string, any>;
};
export declare function useModalForm(): ModalFormState;
export declare function ModalFormProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export interface ModalFormProps {
    modalId?: string;
    id?: string;
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
export declare function ModalForm({ modalId: thisModalId, title, fields, schema, endpoint, parseFetchedData, mutationParams, buttonLabel, onSuccess, cols, }: ModalFormProps): import("react/jsx-runtime").JSX.Element | null;
export {};
