import { FieldInterface } from "../../types";
export interface ModelFormProps {
    key?: string;
    modelName: string;
    schema: any;
    mode?: "register" | "edit";
    fields: FieldInterface[];
    defaultValues?: any;
    mutationParams?: Record<string, any>;
    onFetch?: (values: Record<string, any>) => void;
    onChange?: (values: Record<string, any>) => void;
    onSubmit?: (values: Record<string, any>) => void;
    onAfterSubmit?: (response: any) => void;
    onBeforeSubmit?: (values: Record<string, any>) => Promise<any>;
    parseFetchedData?: (values: Record<string, any>) => Promise<any>;
    cols?: number;
    id?: string;
    buttonLabel?: string | boolean;
    redirectAfterRegister?: boolean;
}
export declare function ModelForm({ onBeforeSubmit, onAfterSubmit, onChange, onSubmit, onFetch, modelName, schema, fields, defaultValues, mutationParams, mode: defaultMode, parseFetchedData, redirectAfterRegister, buttonLabel, cols, ...props }: ModelFormProps): import("react/jsx-runtime").JSX.Element;
