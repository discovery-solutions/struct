# Skill: Model Structure - Como organizar modelos

## Descrição
Organização recomendada para modelos no `@discovery-solutions/struct`. Uma estrutura bem organizada facilita manutenção, escalabilidade e colaboração em equipe.

## Estrutura recomendada

```
@/models/
├── identity/
│   ├── user/
│   │   ├── index.ts          # Types e Zod schemas
│   │   ├── model.ts          # Mongoose model
│   │   ├── schema.ts         # UI schemas (columns, fields)
│   │   └── constants.ts      # Enums, options, dados estáticos
│   └── enterprise/
│       ├── index.ts
│       ├── model.ts
│       ├── schema.ts
│       └── constants.ts
├── crm/
│   ├── lead/
│   │   ├── index.ts
│   │   ├── model.ts
│   │   ├── schema.ts
│   │   └── constants.ts
│   └── contact/
│       ├── index.ts
│       ├── model.ts
│       ├── schema.ts
│       └── constants.ts
└── products/
    ├── product/
    │   ├── index.ts
    │   ├── model.ts
    │   ├── schema.ts
    │   └── constants.ts
    └── category/
        ├── index.ts
        ├── model.ts
        ├── schema.ts
        └── constants.ts
```

## Arquivos

### 1. index.ts - Types e Validation

Defina interfaces TypeScript e schemas Zod.

```typescript
// @/models/identity/user/index.ts
import { z } from "zod";

export interface UserInterface {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "manager" | "user";
  active: boolean;
  avatar?: string;
  phone?: string;
  enterprise?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export const userCreateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  role: z.enum(["admin", "manager", "user"]).default("user"),
  active: z.boolean().default(true),
  avatar: z.string().url().optional(),
  phone: z.string().optional(),
  enterprise: z.string().optional(),
});

export const userUpdateSchema = userCreateSchema
  .partial()
  .omit({ password: true });
```

### 2. model.ts - Mongoose Model

Defina o schema e model do Mongoose.

```typescript
// @/models/identity/user/model.ts
import mongoose, { Schema } from "mongoose";
import { UserInterface } from "./index";
import { Enterprise } from "../enterprise/model";

export * from "./index";

const UserSchema = new Schema<UserInterface>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["admin", "manager", "user"],
      default: "user",
      required: true
    },
    active: { type: Boolean, default: true },
    avatar: { type: String },
    phone: { type: String },
    enterprise: {
      type: Schema.Types.ObjectId,
      ref: Enterprise,
      index: true
    },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

UserSchema.index({ email: 1, deletedAt: 1 });

export const User =
  mongoose.models?.User ||
  mongoose.model<UserInterface>("User", UserSchema);
```

### 3. schema.ts - UI Schemas

Defina colunas para tabelas e fields para formulários.

```typescript
// @/models/identity/user/schema.ts
import { ColumnDef } from "@tanstack/react-table";
import { FieldInterface } from "@discovery-solutions/struct/client";
import { UserInterface } from "./index";
import { ROLES } from "./constants";

export * from "./index";

export const userColumns: ColumnDef<UserInterface>[] = [
  {
    header: "Nome",
    accessorKey: "name"
  },
  {
    header: "Email",
    accessorKey: "email"
  },
  {
    header: "Cargo",
    accessorKey: "role",
    cell: ({ row }) => ROLES[row.original.role]
  },
  {
    header: "Status",
    accessorKey: "active",
    cell: ({ row }) => (
      <span className={row.original.active ? "text-green-600" : "text-red-600"}>
        {row.original.active ? "Ativo" : "Inativo"}
      </span>
    )
  }
];

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
    name: "password",
    type: "password",
    label: "Senha",
    placeholder: "••••••",
    description: "Mínimo 6 caracteres"
  },
  {
    name: "role",
    type: "select",
    label: "Cargo",
    required: true,
    options: [
      { label: "Administrador", value: "admin" },
      { label: "Gerente", value: "manager" },
      { label: "Usuário", value: "user" }
    ]
  },
  {
    name: "enterprise",
    type: "model-select",
    label: "Empresa",
    model: "identity/enterprise"
  },
  {
    name: "phone",
    type: "phone",
    label: "Telefone",
    placeholder: "(11) 99999-9999"
  },
  {
    name: "avatar",
    type: "avatar",
    label: "Foto de Perfil"
  },
  {
    name: "active",
    type: "switch",
    label: "Ativo"
  }
];
```

### 4. constants.ts - Constantes

Defina enums, options e dados estáticos.

```typescript
// @/models/identity/user/constants.ts
export const ROLES = {
  admin: "Administrador",
  manager: "Gerente",
  user: "Usuário"
} as const;

export const ROLE_OPTIONS = [
  { label: "Administrador", value: "admin" },
  { label: "Gerente", value: "manager" },
  { label: "Usuário", value: "user" }
];

export const USER_STATUS = {
  active: "Ativo",
  inactive: "Inativo",
  pending: "Pendente"
} as const;
```

## Uso nos endpoints

```typescript
// app/api/identity/users/[[...id]]/route.ts
import { User, UserInterface, userCreateSchema, userUpdateSchema } from "@/models/identity/user/model";
import { CRUDController } from "@/struct";

export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User, {
  softDelete: true,
  createSchema: userCreateSchema,
  updateSchema: userUpdateSchema,
  populate: ["enterprise"],
  roles: {
    GET: "*",
    POST: "admin",
    PATCH: ["admin", "manager"],
    DELETE: "admin"
  }
});
```

## Uso nos componentes

```typescript
// app/(dashboard)/identity/users/page.tsx
import { TableView, ModalForm, ModalFormProvider } from "@discovery-solutions/struct/client";
import { userColumns, userFields, userCreateSchema } from "@/models/identity/user/schema";

export default function UsersPage() {
  return (
    <ModalFormProvider>
      <TableView
        endpoint="identity/users"
        columns={userColumns}
      />
      
      <ModalForm
        modalId="user-form"
        title="Novo Usuário"
        endpoint="identity/users"
        schema={userCreateSchema}
        fields={userFields}
      />
    </ModalFormProvider>
  );
}
```

## Vantagens desta estrutura

### Separação de responsabilidades
- `index.ts` → tipos e validação (shared)
- `model.ts` → lógica de banco (server-only)
- `schema.ts` → UI components (client-only)
- `constants.ts` → dados estáticos (shared)

### Reusabilidade
- Importe apenas o que precisa
- Evite circular dependencies
- Facilita tree-shaking

### Escalabilidade
- Fácil adicionar novos modelos
- Estrutura consistente
- Fácil de encontrar arquivos

### Type Safety
- Types compartilhados entre front e back
- Auto-complete funciona perfeitamente
- Menos erros em runtime

## Dicas

### Re-exports
Use re-exports para facilitar importação:

```typescript
// model.ts
export * from "./index";
```

```typescript
// schema.ts
export * from "./index";
```

Isso permite:
```typescript
import { User, UserInterface, userCreateSchema } from "@/models/identity/user/model";
```

### Grouping por domínio
Agrupe modelos relacionados por domínio de negócio:
- `identity/` - usuários, empresas, autenticação
- `crm/` - leads, contatos, oportunidades
- `products/` - produtos, categorias, estoque
- `finance/` - transações, pagamentos, faturas

### Naming conventions
- Interfaces: `{Model}Interface`
- Models: `{Model}` (PascalCase)
- Schemas: `{model}CreateSchema`, `{model}UpdateSchema`
- Columns: `{model}Columns`
- Fields: `{model}Fields`
- Constants: `UPPER_SNAKE_CASE`

### Index files
Crie index files em cada pasta para facilitar imports:

```typescript
// @/models/identity/index.ts
export * from "./user/model";
export * from "./enterprise/model";
```

```typescript
import { User, Enterprise } from "@/models/identity";
```

## Exemplo completo de modelo

Ver os arquivos de exemplo criados acima que mostram um modelo completo de usuário com:
- Types e validation (index.ts)
- Mongoose model (model.ts)
- UI schemas (schema.ts)
- Constants (constants.ts)

Esta estrutura garante organização, manutenibilidade e escalabilidade do projeto.
