"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useCallback } from "react";
import { useStructUI } from "../../provider";
import { cn } from "../../utils";
export const FieldRender = ({ errors, fields, cols = 3, loading = false, disabled, onChange, onSubmit, initialValues: propsInitialValues, buttonLabel = "Continuar", }) => {
    const Struct = useStructUI();
    const initialValues = useMemo(() => {
        if (propsInitialValues)
            return propsInitialValues;
        return fields.reduce((acc, field) => {
            return setNestedValue(acc, field.name, field.defaultValue ?? (field.type === "checkbox" ? [] : ""));
        }, {});
    }, [fields, propsInitialValues]);
    const [values, setValues] = useState(initialValues);
    const getValue = (name) => {
        if (!name.includes("."))
            return values[name];
        let data = { ...values };
        for (const key of name?.split("."))
            data = data?.[key];
        return data;
    };
    const isConditionalMet = (field, values) => {
        if (!field.conditional)
            return true;
        const actual = getValue(field.conditional.field);
        const expected = Array.isArray(field.conditional.value) ? field.conditional.value : [field.conditional.value];
        return expected.includes(actual);
    };
    const hasUnfilledRequiredFields = fields.some(field => {
        if (field.conditional && !isConditionalMet(field, values))
            return false;
        const isEmpty = typeof getValue(field.name) === "undefined" || getValue(field.name)?.length === 0;
        return field.required && isEmpty;
    });
    const handleChange = useCallback((e) => {
        const { name, value, checked, type } = e.target;
        setValues(prev => {
            const newValue = type === "checkbox" ? checked : value;
            const newValues = setNestedValue({ ...prev }, name, newValue);
            onChange?.(newValues);
            return newValues;
        });
    }, [onChange]);
    const onClick = (e) => {
        e.preventDefault();
        handleSubmit();
    };
    const handleSubmit = (e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        try {
            onSubmit?.(values);
        }
        catch (err) {
            console.error(err);
            Struct.toast.error("Erro ao enviar o formulário");
        }
    };
    const getComponentByType = (type) => {
        const name = Struct.alias[type];
        return Struct[name];
    };
    return (_jsxs("form", { onSubmit: handleSubmit, children: [_jsx("div", { className: `grid ${COL_GRID[cols]} gap-4 w-full`, children: fields.map(({ defaultValue, ...field }) => {
                    if (!isConditionalMet(field, values))
                        return null;
                    const Component = getComponentByType(field.type);
                    if (!Component)
                        return null;
                    const error = getNestedError(errors, field);
                    const commonProps = {
                        ...field,
                        value: typeof getValue(field.name) !== "undefined" ? getValue(field.name) : defaultValue,
                        onChange: handleChange,
                        className: cn("w-full", field.className),
                        disabled,
                    };
                    return (_jsxs("div", { className: cn(COL_SPAN[field.colSpan ?? cols]), children: [field.label && _jsx("label", { htmlFor: field.name, className: "mb-1 block text-sm font-medium", children: field.label }), _jsx(Component, { ...commonProps }), error && (_jsx("span", { className: "text-sm text-red-500", children: error }))] }, field.name));
                }) }), (onSubmit && buttonLabel) && (_jsx(Struct.Button, { onClick: onClick, type: "submit", disabled: hasUnfilledRequiredFields || loading, className: "min-w-[12rem] mt-6", children: loading ? "Carregando..." : buttonLabel }))] }));
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
};
function getNestedError(errors, field) {
    const key = field.key || field.name;
    return errors?.[key];
}
function setNestedValue(obj, path, value) {
    const keys = path?.split(".");
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]])
            current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    return { ...obj };
}
