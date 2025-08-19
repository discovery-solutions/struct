"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelForm = ModelForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_query_1 = require("@tanstack/react-query");
const navigation_1 = require("next/navigation");
const react_1 = require("react");
const provider_1 = require("../../provider");
const renderer_1 = require("./renderer");
const utils_1 = require("../../utils");
const zod_1 = require("zod");
function ModelForm({ onBeforeSubmit, onAfterSubmit, onChange, onSubmit, onFetch, modelName, schema, fields, defaultValues, mutationParams, mode: defaultMode, parseFetchedData, redirectAfterRegister = true, buttonLabel = false, cols, ...props }) {
    const [errors, setErrors] = (0, react_1.useState)({});
    const { Loader, toast } = (0, provider_1.useStructUI)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const params = (0, navigation_1.useParams)();
    const router = (0, navigation_1.useRouter)();
    const id = props.id || params.id;
    const mode = defaultMode || (id ? "edit" : "register");
    const endpoint = `/api/${modelName}${mode === "edit" ? `/${id}` : ""}`;
    const { data: fetchedData, isLoading: isLoadingData, ...query } = (0, react_query_1.useQuery)({
        queryKey: [modelName, id],
        enabled: !!id,
        queryFn: () => (0, utils_1.fetcher)(endpoint).then(async (data) => {
            const raw = { ...defaultValues, ...data };
            if (!parseFetchedData)
                return raw;
            return await Promise.resolve(parseFetchedData(raw));
        }),
    });
    (0, react_1.useEffect)(() => {
        if (fetchedData && onFetch)
            onFetch?.(fetchedData);
    }, [fetchedData]);
    (0, react_1.useEffect)(() => {
        if (query.error) {
            console.error(query.error);
            toast.error(query.error?.message || "Erro ao carregar dados");
        }
    }, [query.error]);
    const mutation = (0, react_query_1.useMutation)({
        mutationFn: async (values) => {
            const parsed = schema.parse({ ...values, ...mutationParams });
            const method = mode === "edit" ? "PATCH" : "POST";
            return (0, utils_1.fetcher)(endpoint, { method, body: parsed });
        },
        onSuccess: (res) => {
            toast.success(mode === "edit" ? "Atualizado com sucesso!" : "Criado com sucesso!");
            queryClient.invalidateQueries({ queryKey: [modelName] });
            if (mode === "register" && redirectAfterRegister)
                router.back();
            return res;
        },
        onError: (err) => {
            if (err instanceof zod_1.z.ZodError) {
                const fieldErrors = err.flatten().fieldErrors;
                const formatted = Object.fromEntries(Object.entries(fieldErrors).map(([key, [msg]]) => [key, msg || "Campo inválido"]));
                setErrors(formatted);
                toast.error("Corrija os campos destacados");
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
    return isLoadingData ? ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center items-center py-10", children: (0, jsx_runtime_1.jsx)(Loader, {}) }, props.key + "-loading")) : ((0, jsx_runtime_1.jsx)(renderer_1.FieldRender, { fields: fields, errors: errors, loading: mutation.isPending, initialValues: fetchedData || defaultValues, onSubmit: handleSubmit, onChange: onChange, buttonLabel: buttonLabel, disabled: mutation.isPending, cols: cols }, props.key));
}
