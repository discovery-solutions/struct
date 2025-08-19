import { ReactNode } from "react";
import { z } from "zod";
type ModalFormState = {
    id?: string;
    open: boolean;
    openModal: (options?: {
        id?: string;
    }) => void;
    closeModal: () => void;
};
export declare function useModalForm(): ModalFormState;
export declare function ModalFormProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
interface ModalFormProps {
    id?: string;
    title?: string;
    modelName: string;
    fields: any[];
    schema: z.ZodSchema<any>;
    parseFetchedData?: (data: any) => Promise<any>;
    mutationParams?: Record<string, any>;
    buttonLabel?: string | boolean;
    onSuccess?: (response: any) => any;
    cols?: number;
}
export declare function ModalForm({ title, modelName, fields, schema, parseFetchedData, mutationParams, buttonLabel, onSuccess, cols, }: ModalFormProps): import("react/jsx-runtime").JSX.Element | null;
export {};
