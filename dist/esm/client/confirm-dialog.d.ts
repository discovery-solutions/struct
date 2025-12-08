import { ReactNode } from "react";
export type ConfirmDialogProps = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    title?: string;
    description?: string | ReactNode;
    endpoint?: string;
    params?: {
        id: string;
    };
    method?: "DELETE" | "PATCH" | "POST";
    onSuccess?: () => void;
    onPress?: () => void;
    onError?: (error: any) => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    children?: ReactNode;
};
export declare const ConfirmDialog: import("react").ForwardRefExoticComponent<ConfirmDialogProps & import("react").RefAttributes<HTMLDivElement>>;
export declare const useConfirmDialog: () => {
    open: boolean;
    setOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    trigger: () => void;
};
