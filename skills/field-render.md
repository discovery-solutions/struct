# Skill: FieldRender - Renderer de Campos

## Descrição

`FieldRender` é um componente React do `@discovery-solutions/struct` que renderiza campos de formulário baseado em um array de `FieldInterface`. Diferente do `ModelForm`, não gerencia validação Zod ou submission - apenas renderiza os campos e gerencia o estado local. Perfeito para formulários customizados ou fluxos multi-step.

## Quando usar

- Formulários com lógica de submit customizada
- Wizards ou formulários em múltiplas etapas
- Formulários que precisam de validação manual
- Quando você quer controle total sobre o submit
- Layouts de formulário totalmente customizados

## Como usar

### Import

```typescript
import {
  FieldRender,
  FieldRenderProps,
} from "@discovery-solutions/struct/client";
```

### Props disponíveis

```typescript
interface FieldRenderProps extends React.FormHTMLAttributes<HTMLFormElement> {
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
```

## Exemplos de uso

### Renderizando campos básico

```typescript
import { FieldRender } from "@discovery-solutions/struct/client";
import { userFields } from "@/models/identity/user/schema";

export default function CustomUserForm() {
  const handleSubmit = (values) => {
    console.log("Valores do formulário:", values);
    // Sua lógica de submit aqui
  };

  return (
    <FieldRender
      fields={userFields}
      onSubmit={handleSubmit}
      buttonLabel="Salvar"
    />
  );
}
```

### Com grid de colunas

```typescript
<FieldRender
  fields={userFields}
  cols={2}
  onSubmit={handleSubmit}
  buttonLabel="Cadastrar"
/>
```

### Com valores iniciais

```typescript
<FieldRender
  fields={userFields}
  initialValues={{
    name: "João Silva",
    role: "admin",
    active: true
  }}
  onSubmit={handleSubmit}
/>
```

### Sem botão de submit

```typescript
<FieldRender
  fields={userFields}
  buttonLabel={null}
  onChange={(values) => {
    // Atualiza estado em tempo real
    setFormData(values);
  }}
/>
```

### Com erros de validação manual

```typescript
function MyForm() {
  const [errors, setErrors] = useState({});

  const handleSubmit = (values) => {
    // Validação customizada
    const newErrors = {};
    if (!values.email.includes("@")) {
      newErrors.email = "Email inválido";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Submit válido
    saveData(values);
  };

  return (
    <FieldRender
      fields={userFields}
      errors={errors}
      onSubmit={handleSubmit}
    />
  );
}
```

### Com loading state

```typescript
<FieldRender
  fields={userFields}
  loading={isSaving}
  onSubmit={handleSubmit}
  buttonLabel={isSaving ? "Salvando..." : "Salvar"}
/>
```

### Controlled com onChange

```typescript
function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const step1Fields = [
    { name: "name", type: "text", label: "Nome" },
    { name: "email", type: "email", label: "Email" }
  ];

  const step2Fields = [
    { name: "phone", type: "phone", label: "Telefone" },
    { name: "address", type: "text", label: "Endereço" }
  ];

  const currentFields = step === 1 ? step1Fields : step2Fields;

  return (
    <FieldRender
      fields={currentFields}
      onChange={setFormData}
      onSubmit={(values) => {
        if (step === 1) {
          setStep(2);
        } else {
          saveData({ ...formData, ...values });
        }
      }}
      buttonLabel={step === 1 ? "Próximo" : "Finalizar"}
    />
  );
}
```

### Com campos condicionais

```typescript
const conditionalFields: FieldInterface[] = [
  {
    name: "type",
    type: "select",
    label: "Tipo",
    options: [
      { label: "Pessoa Física", value: "pf" },
      { label: "Pessoa Jurídica", value: "pj" }
    ]
  },
  {
    name: "cpf",
    type: "text",
    label: "CPF",
    conditional: { field: "type", value: "pf" }
  },
  {
    name: "cnpj",
    type: "text",
    label: "CNPJ",
    conditional: { field: "type", value: "pj" }
  }
];

<FieldRender
  fields={conditionalFields}
  onSubmit={handleSubmit}
/>
```

### Com colSpan nos campos

```typescript
const fields: FieldInterface[] = [
  { name: "name", type: "text", label: "Nome", colSpan: 2 },
  { name: "email", type: "email", label: "Email" },
  { name: "phone", type: "phone", label: "Telefone" },
  { name: "bio", type: "textarea", label: "Biografia", colSpan: 3 }
];

<FieldRender fields={fields} cols={3} onSubmit={handleSubmit} />
```

### Disabled mode

```typescript
<FieldRender
  fields={userFields}
  initialValues={userData}
  disabled={isViewOnly}
  buttonLabel={null}
/>
```

### Com formRef para validação externa

```typescript
function FormWithValidation() {
  const formRef = useRef(null);

  const handleValidate = () => {
    // Força trigger de validação se necessário
    formRef.current?.reportValidity();
  };

  return (
    <>
      <FieldRender
        ref={formRef}
        fields={userFields}
        onSubmit={handleSubmit}
      />
      <button onClick={handleValidate}>Validar</button>
    </>
  );
}
```

### Integrando com API via fetcher

```typescript
import { FieldRender, fetcher } from "@discovery-solutions/struct/client";

function CreateUserForm() {
  const handleSubmit = async (values) => {
    try {
      const result = await fetcher("/api/identity/users", {
        method: "POST",
        body: values
      });
      toast.success("Usuário criado!");
      router.push("/users");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <FieldRender
      fields={userFields}
      onSubmit={handleSubmit}
      buttonLabel="Criar Usuário"
    />
  );
}
```

## Diferenças entre FieldRender e ModelForm

### FieldRender

- Sem validação Zod automática
- Sem integração com API automática
- Total controle sobre submit
- Estado local gerenciado internamente
- Perfeito para casos customizados

### ModelForm

- Validação Zod automática
- Integração API automática (POST/PATCH)
- Carga de dados no modo edit
- Mais simples para casos padrão
- Perfeito para CRUDs rápidos

## Comportamento automático

### Estado interno

- Gerencia estado dos campos internamente
- Suporta valores aninhados (ex: `user.name`)
- Preenche defaultValues automaticamente

### Campos condicionais

- Oculta campos quando condição não satisfeita
- Suporta valores únicos ou arrays de valores

### Layout grid

- Suporta 1, 2 ou 3 colunas
- colSpan nos campos controla distribuição
- Responsivo (mobile = 1 coluna)

## Dicas

- Use ModelForm para CRUDs automáticos
- Use FieldRender quando precisa de lógica customizada
- Combine com React Hook Form se precisar de validação complexa
- Use `buttonLabel={null}` para renderizar apenas campos
- Accesse valores via onChange para formulários em tempo real
