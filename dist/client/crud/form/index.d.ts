import { FieldInterface } from "../../types";
export interface ModelFormProps {
    key?: string;
    endpoint: string;
    schema: any;
    mode?: "register" | "edit";
    fields: FieldInterface[];
    defaultValues?: any;
    mutationParams?: Record<string, any>;
    onFetch?: (values: Record<string, any>) => any;
    onChange?: (values: Record<string, any>) => any;
    onSubmit?: (values: Record<string, any>) => any;
    onAfterSubmit?: (response: any) => any;
    onBeforeSubmit?: (values: Record<string, any>) => Promise<any>;
    parseFetchedData?: (values: Record<string, any>) => Promise<any>;
    cols?: number;
    id?: string;
    buttonLabel?: string | boolean;
    redirectAfterRegister?: boolean;
}
export declare function ModelForm({ onBeforeSubmit, onAfterSubmit, onChange, onSubmit, onFetch, schema, fields, defaultValues, mutationParams, mode: defaultMode, parseFetchedData, redirectAfterRegister, buttonLabel, cols, ...props }: ModelFormProps): import("react/jsx-runtime").JSX.Element;
