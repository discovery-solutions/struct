type ConfirmDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    modelName?: string;
    params?: {
        id: string;
    };
    method?: "DELETE" | "PATCH" | "POST";
    onSuccess?: () => void;
    onPress?: () => void;
    onError?: (error: any) => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
};
export declare const ConfirmDialog: ({ open, onOpenChange, title, description, modelName, params, method, onSuccess, onPress, onError, variant, }: ConfirmDialogProps) => import("react/jsx-runtime").JSX.Element;
export {};
