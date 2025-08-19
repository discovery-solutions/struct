import { FieldInterface } from "../../types";
export interface FieldRenderProps {
    errors?: Record<string, string | undefined>;
    fields: FieldInterface[];
    cols?: number;
    loading?: boolean;
    onChange?: (values: Record<string, any>) => void;
    onSubmit?: (values: Record<string, any>) => void;
    initialValues?: Record<string, any>;
    buttonLabel?: string | null | React.ReactNode;
    disabled?: boolean;
}
export declare const FieldRender: ({ errors, fields, cols, loading, disabled, onChange, onSubmit, initialValues: propsInitialValues, buttonLabel, }: FieldRenderProps) => import("react/jsx-runtime").JSX.Element;
