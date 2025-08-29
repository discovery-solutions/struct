"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStructUI } from "../../provider";
import { FieldRender } from "./renderer";
import { fetcher } from "../../../fetcher";
import { z } from "zod";
export function ModelForm({ onBeforeSubmit, onAfterSubmit, onChange, onSubmit, onFetch, schema, fields, defaultValues, mutationParams, mode: defaultMode, parseFetchedData, redirectAfterRegister = true, buttonLabel, cols, ...props }) {
    const [errors, setErrors] = useState({});
    const { Loader, toast, queryClient } = useStructUI();
    const params = useParams();
    const router = useRouter();
    const id = defaultMode === "register" ? undefined : (props.id || params.id);
    const mode = defaultMode || (id ? "edit" : "register");
    const endpoint = `/api/${props.endpoint}${mode === "edit" ? `/${id}` : ""}`;
    const { data: fetchedData, isLoading: isLoadingData, ...query } = useQuery({
        queryKey: [endpoint, id],
        enabled: !!id,
        queryFn: () => fetcher(endpoint).then(async (data) => {
            const raw = { ...defaultValues, ...data };
            if (!parseFetchedData)
                return raw;
            return await Promise.resolve(parseFetchedData(raw));
        }),
    });
    useEffect(() => {
        if (fetchedData && onFetch)
            onFetch?.(fetchedData);
    }, [fetchedData]);
    useEffect(() => {
        if (query.error) {
            console.error(query.error);
            toast.error(query.error?.message || "Erro ao carregar dados");
        }
    }, [query.error]);
    const mutation = useMutation({
        mutationFn: async (values) => {
            const parsed = schema.parse({ ...values, ...mutationParams });
            const method = mode === "edit" ? "PATCH" : "POST";
            return fetcher(endpoint, { method, body: parsed });
        },
        onSuccess: (res) => {
            toast.success(mode === "edit" ? "Atualizado com sucesso!" : "Criado com sucesso!");
            queryClient.invalidateQueries({
                predicate: (query) => Array.isArray(query.queryKey) &&
                    query.queryKey.some((key) => (typeof key === "string" ? key : JSON.stringify(key)).includes(endpoint)),
            });
            if (mode === "register" && redirectAfterRegister)
                router.back();
            return res;
        },
        onError: (err) => {
            console.log("onError", err);
            if (err instanceof z.ZodError) {
                const fieldErrors = err.flatten().fieldErrors;
                const formatted = Object.fromEntries(Object.entries(fieldErrors).map(([key, [msg]]) => [key, msg || "Campo inválido"]));
                setErrors(formatted);
                toast.error("Corrija os campos destacados");
            }
            else if (Array.isArray(err)) {
                for (const item of err) {
                    console.log(item);
                    toast.error(item || "Erro ao salvar");
                }
            }
            else {
                console.error(err);
                toast.error(err.message || "Erro ao salvar");
            }
        },
    });
    const handleSubmit = async (values) => {
        setErrors({});
        const updatedData = onBeforeSubmit ? await Promise.resolve(onBeforeSubmit(values)) : values;
        let res;
        if (onSubmit) {
            res = onSubmit(updatedData);
        }
        else {
            res = await mutation.mutateAsync(updatedData);
        }
        if (onAfterSubmit)
            onAfterSubmit(res);
    };
    return isLoadingData ? (_jsx("div", { className: "flex justify-center items-center py-10", children: _jsx(Loader, {}) }, props.key + "-loading")) : (_jsx(FieldRender, { fields: fields, errors: errors, loading: mutation.isPending, initialValues: fetchedData || defaultValues, onSubmit: handleSubmit, onChange: onChange, buttonLabel: buttonLabel, disabled: mutation.isPending, cols: cols }, props.key));
}
