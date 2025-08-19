"use client";
export interface StructToast {
  (message: string, opts?: { description?: string; action?: { label: string; onClick: () => void } }): void;
  success: (message: string, opts?: { description?: string }) => void;
  error: (message: string, opts?: { description?: string }) => void;
  info?: (message: string, opts?: { description?: string }) => void;
  warning?: (message: string, opts?: { description?: string }) => void;
}

export interface StructUIConfig {
  Button: React.ComponentType<any>;
  Input: React.ComponentType<any>;
  Loader: React.ComponentType<any>;
  DataTable: React.ComponentType<any>;
  Card: {
    Header: React.ComponentType<any>;
    Content: React.ComponentType<any>;
    Title: React.ComponentType<any>;
    Description: React.ComponentType<any>;
  };
  Dialog: {
    Trigger: React.ComponentType<any>;
    Root: React.ComponentType<any>;
    Content: React.ComponentType<any>;
    Header: React.ComponentType<any>;
    Title: React.ComponentType<any>;
    Description: React.ComponentType<any>;
    Footer: React.ComponentType<any>;
  };
  Dropdown: {
    Root: React.ComponentType<any>;
    Trigger: React.ComponentType<any>;
    Content: React.ComponentType<any>;
    Item: React.ComponentType<any>;
  };
  toast: StructToast;
  alias: Record<string, string>;
  [key: string]: any;
}

type FieldTypeFromStruct<Alias extends Record<string, string> = StructUIConfig["alias"]> = keyof Alias;


export interface FieldInterface {
  type: FieldTypeFromStruct;
  placeholder?: string;
  key?: string;
  label?: string;
  name: string;
  required?: boolean;
  options?: string[] | { value: string | boolean | number; label: string }[];
  colSpan?: number;
  mask?: string;
  defaultValue?: string | string[] | boolean | number | null;
  className?: string;
  conditional?: {
    field: string;
    value: string | string[];
  };
  [key: string]: any;
}