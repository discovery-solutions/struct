# Skill: ModelForm - Formulários com validação

## Descrição
`ModelForm` é um componente React do `@discovery-solutions/struct` que cria formulários completos com validação Zod, integração com React Hook Form, e conexão automática com APIs. Suporta modos de registro (create) e edição (update).

## Quando usar
- Criar formulários de cadastro (create/register)
- Criar formulários de edição (edit/update)
- Formulários com validação Zod
- Formulários que se conectam a endpoints CRUD
- Formulários com diferentes tipos de campos

## Como usar

### Import
```typescript
import { ModelForm } from "@discovery-solutions/struct/client";
```

### Props disponíveis
```typescript
interface ModelFormProps {
  endpoint: string;
  schema: ZodSchema;
  fields: FieldInterface[];
  mode?: "register" | "edit";
  defaultValues?: any;
  id?: string;
  cols?: number;
  buttonLabel?: string | boolean;
  redirectAfterRegister?: boolean;
  mutationParams?: Record<string, any>;
  onFetch?: (values: Record<string, any>) => any;
  onChange?: (values: Record<string, any>) => any;
  onSubmit?: (values: Record<string, any>) => any;
  onAfterSubmit?: (response: any) => any;
  onBeforeSubmit?: (values: Record<string, any>) => Promise<any>;
  parseFetchedData?: (values: Record<string, any>) => Promise<any>;
}
```

## Exemplos de uso

### Formulário de cadastro (register)

```typescript
import { ModelForm } from "@discovery-solutions/struct/client";
import { userFields, userCreateSchema } from "@/models/identity/user/schema";

export default function UserRegisterPage() {
  return (
    <ModelForm
      endpoint="identity/users"
      schema={userCreateSchema}
      fields={userFields}
      mode="register"
      buttonLabel="Cadastrar Usuário"
    />
  );
}
```

### Formulário de edição (edit)

```typescript
import { ModelForm } from "@discovery-solutions/struct/client";
import { userFields, userUpdateSchema } from "@/models/identity/user/schema";

export default function UserEditPage({ params }: { params: { id: string } }) {
  return (
    <ModelForm
      endpoint="identity/users"
      schema={userUpdateSchema}
      fields={userFields}
      mode="edit"
      id={params.id}
      buttonLabel="Salvar Alterações"
    />
  );
}
```

### Com valores padrão

```typescript
<ModelForm
  endpoint="identity/users"
  schema={userCreateSchema}
  fields={userFields}
  mode="register"
  defaultValues={{
    role: "broker",
    active: true
  }}
/>
```

### Com grid de múltiplas colunas

```typescript
<ModelForm
  endpoint="identity/users"
  schema={userCreateSchema}
  fields={userFields}
  cols={2}
/>
```

### Com callbacks

```typescript
<ModelForm
  endpoint="identity/users"
  schema={userCreateSchema}
  fields={userFields}
  onBeforeSubmit={async (values) => {
    return {
      ...values,
      createdBy: currentUser.id
    };
  }}
  onAfterSubmit={(response) => {
    console.log("Usuário criado:", response);
    router.push("/users");
  }}
  onChange={(values) => {
    console.log("Valores alterados:", values);
  }}
/>
```

### Com processamento de dados do servidor

```typescript
<ModelForm
  endpoint="identity/users"
  schema={userUpdateSchema}
  fields={userFields}
  mode="edit"
  parseFetchedData={async (data) => {
    return {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : null
    };
  }}
/>
```

### Sem redirecionar após cadastro

```typescript
<ModelForm
  endpoint="identity/users"
  schema={userCreateSchema}
  fields={userFields}
  redirectAfterRegister={false}
  onAfterSubmit={(response) => {
    toast.success("Usuário criado! Criar outro?");
  }}
/>
```

### Com parâmetros extras na mutation

```typescript
<ModelForm
  endpoint="identity/users"
  schema={userCreateSchema}
  fields={userFields}
  mutationParams={{
    organizationId: currentOrg.id
  }}
/>
```

## Definindo Fields

### Exemplo básico de fields
```typescript
import { FieldInterface } from "@discovery-solutions/struct/client";

export const userFields: FieldInterface[] = [
  {
    name: "name",
    type: "text",
    label: "Nome Completo",
    placeholder: "João Silva",
    required: true
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "joao@example.com",
    required: true
  },
  {
    name: "role",
    type: "select",
    label: "Cargo",
    required: true,
    options: [
      { label: "Administrador", value: "admin" },
      { label: "Usuário", value: "user" }
    ]
  }
];
```

### Fields com colSpan

```typescript
export const userFields: FieldInterface[] = [
  {
    name: "name",
    type: "text",
    label: "Nome",
    colSpan: 2
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    colSpan: 1
  },
  {
    name: "phone",
    type: "text",
    label: "Telefone",
    colSpan: 1
  }
];
```

## Validação com Zod

### Schema de criação
```typescript
import { z } from "zod";

export const userCreateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum(["admin", "user"]).default("user"),
  active: z.boolean().default(true)
});
```

### Schema de atualização
```typescript
export const userUpdateSchema = userCreateSchema
  .partial()
  .omit({ password: true });
```

## Comportamento automático

### Modo register
- Faz POST para o endpoint
- Redireciona para página anterior após sucesso (se `redirectAfterRegister: true`)
- Não carrega dados do servidor

### Modo edit
- Carrega dados do servidor via GET
- Faz PATCH para o endpoint com o ID
- Não redireciona após sucesso
- Preenche automaticamente os campos com os dados

## Integração com TanStack Query

O ModelForm usa TanStack Query internamente:
- Busca dados automaticamente no modo edit
- Invalida queries relacionadas após mutation
- Gerencia loading e erro states

## Mensagens de sucesso/erro

O ModelForm mostra automaticamente:
- Toast de sucesso ao criar/editar
- Toast de erro em validação ou falha de request
- Destaque visual em campos com erro

## Dicas
- Defina schemas separados para create e update
- Use `parseFetchedData` para transformar dados do servidor (ex: datas)
- Use `onBeforeSubmit` para adicionar campos automáticos (ex: userId)
- Configure `cols` para layout responsivo
- Use `colSpan` nos fields para controlar tamanho individual
