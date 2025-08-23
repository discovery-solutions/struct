"use client";
import { useState, useMemo, useCallback } from "react";
import { FieldInterface } from "../../types";
import { useStructUI } from "../../provider";
import { cn } from "../../utils";

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

export const FieldRender = ({
  errors,
  fields,
  cols = 3,
  loading = false,
  disabled,
  onChange,
  onSubmit,
  initialValues: propsInitialValues,
  buttonLabel = "Continuar",
}: FieldRenderProps) => {
  const Struct = useStructUI();
  const initialValues = useMemo(() => {
    if (propsInitialValues) return propsInitialValues;

    return fields.reduce((acc, field) => {
      return setNestedValue(acc, field.name, field.defaultValue ?? (field.type === "checkbox" ? [] : ""));
    }, {});
  }, [fields, propsInitialValues]);

  const [values, setValues] = useState<Record<string, any>>(initialValues);

  const getValue = (name: string) => {
    if (!name.includes(".")) return values[name];

    let data = { ...values };
    for (const key of name?.split("."))
      data = data?.[key];

    return data;
  }

  const isConditionalMet = (field: FieldInterface, values: Record<string, any>) => {
    if (!field.conditional) return true;
    const actual = getValue(field.conditional.field);
    const expected = Array.isArray(field.conditional.value) ? field.conditional.value : [field.conditional.value];
    return expected.includes(actual);
  };

  const hasUnfilledRequiredFields = fields.some(field => {
    if (field.conditional && !isConditionalMet(field, values)) return false;
    const isEmpty = typeof getValue(field.name) === "undefined" || getValue(field.name)?.length === 0;
    return field.required && isEmpty;
  });

  const handleChange = useCallback(
    (e: any) => {
      const { name, value, checked, type } = e.target;
      setValues(prev => {
        const newValue = type === "checkbox" ? checked : value;
        const newValues = setNestedValue({ ...prev }, name, newValue);
        onChange?.(newValues);
        return newValues;
      });
    },
    [onChange]
  );

  const onClick = (e: any) => {
    e.preventDefault();
    handleSubmit();
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    try {
      onSubmit?.(values);
    } catch (err) {
      console.error(err);
      Struct.toast.error("Erro ao enviar o formulário");
    }
  };

  const getComponentByType = (type: string) => {
    const name = Struct.alias[type];
    return Struct[name];
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={`grid ${(COL_GRID as any)[cols]} gap-4 w-full`}>
        {fields.map(({ defaultValue, ...field }) => {
          if (!isConditionalMet(field, values)) return null;
          const Component = getComponentByType(field.type);
          if (!Component) return null;

          const error = getNestedError(errors, field);
          const commonProps: any = {
            ...field,
            value: typeof getValue(field.name) !== "undefined" ? getValue(field.name) : defaultValue,
            onChange: handleChange,
            className: cn("w-full", field.className),
            disabled,
          };

          return (
            <div key={field.name} className={cn((COL_SPAN as any)[field.colSpan ?? cols])}>
              {field.label && <label htmlFor={field.name} className="mb-1 block text-sm font-medium">{field.label}</label>}
              <Component {...commonProps} />
              {error && (
                <span className="text-sm text-red-500">{error}</span>
              )}
            </div>
          );
        })}
      </div>
      {(onSubmit && buttonLabel) && (
        <Struct.Button onClick={onClick} type="submit" disabled={hasUnfilledRequiredFields || loading} className="min-w-[12rem] mt-6">
          {loading ? "Carregando..." : buttonLabel}
        </Struct.Button>
      )}
    </form>
  );
};

const COL_SPAN = {
  1: "col-span-1 md:col-span-1",
  2: "col-span-1 md:col-span-2",
  3: "col-span-1 md:col-span-3",
};
const COL_GRID = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
}

function getNestedError(errors: any, field: FieldInterface): string | undefined {
  const key = field.key || field.name;
  return errors?.[key];
}

function setNestedValue(obj: any, path: string, value: any) {
  const keys = path?.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return { ...obj };
}
