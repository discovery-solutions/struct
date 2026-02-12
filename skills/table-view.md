# Skill: TableView - Tabelas de dados

## Descrição
`TableView` é um componente React do `@discovery-solutions/struct` que cria tabelas completas com paginação, ordenação, busca e integração automática com endpoints CRUD. Usa TanStack Table (React Table) internamente.

## Quando usar
- Listar dados em formato tabular
- Páginas de listagem/admin
- CRUDs completos com paginação
- Tabelas com busca e ordenação

## Como usar

### Import
```typescript
import { TableView } from "@discovery-solutions/struct/client";
```

### Props básicas
```typescript
interface TableViewProps<T> {
  endpoint: string;
  columns: ColumnDef<T>[];
  asChild?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  LeftItems?: React.ComponentType<{ data: T[] }>;
  RightItems?: React.ComponentType<{ data: T[] }>;
}
```

## Exemplo básico

```typescript
import { TableView } from "@discovery-solutions/struct/client";
import { userColumns } from "@/models/identity/user/schema";

export default function UsersPage() {
  return (
    <TableView
      endpoint="identity/users"
      columns={userColumns}
    />
  );
}
```

## Definindo colunas

### Colunas simples
```typescript
import { ColumnDef } from "@tanstack/react-table";
import { UserInterface } from "@/models/identity/user";

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
    accessorKey: "role"
  }
];
```

### Colunas com formatação custom

```typescript
export const userColumns: ColumnDef<UserInterface>[] = [
  {
    header: "Nome",
    accessorKey: "name"
  },
  {
    header: "Status",
    cell: ({ row }) => (
      <span className={row.original.active ? "text-green-600" : "text-red-600"}>
        {row.original.active ? "Ativo" : "Inativo"}
      </span>
    )
  },
  {
    header: "Data de Criação",
    accessorKey: "createdAt",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("pt-BR")
  }
];
```

### Colunas com ações

```typescript
import { useModalForm } from "@discovery-solutions/struct/client";

export function useUserColumns() {
  const { openModal } = useModalForm();
  
  const columns: ColumnDef<UserInterface>[] = [
    {
      header: "Nome",
      accessorKey: "name"
    },
    {
      header: "Email",
      accessorKey: "email"
    },
    {
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal({ 
              id: row.original._id, 
              modalId: "user-edit" 
            })}
            className="text-blue-600 hover:underline"
          >
            Editar
          </button>
          <button
            onClick={() => handleDelete(row.original._id)}
            className="text-red-600 hover:underline"
          >
            Deletar
          </button>
        </div>
      )
    }
  ];
  
  return columns;
}
```

## Recursos avançados

### Com paginação
```typescript
<TableView
  endpoint="identity/users"
  columns={userColumns}
  enablePagination={true}
  pageSize={20}
/>
```

### Com componentes customizados (header)

```typescript
function UsersHeader({ data }: { data: UserInterface[] }) {
  return (
    <div className="flex justify-between items-center">
      <h1>Usuários ({data.length})</h1>
      <button>Exportar CSV</button>
    </div>
  );
}

export default function UsersPage() {
  return (
    <TableView
      endpoint="identity/users"
      columns={userColumns}
      LeftItems={UsersHeader}
    />
  );
}
```

### Com botões de ação

```typescript
function UsersActions() {
  const { openModal } = useModalForm();
  
  return (
    <button onClick={() => openModal({ modalId: "user-create" })}>
      Novo Usuário
    </button>
  );
}

export default function UsersPage() {
  return (
    <ModalFormProvider>
      <TableView
        endpoint="identity/users"
        columns={userColumns}
        RightItems={UsersActions}
      />
      
      <ModalForm
        modalId="user-create"
        title="Novo Usuário"
        endpoint="identity/users"
        schema={userCreateSchema}
        fields={userFields}
      />
    </ModalFormProvider>
  );
}
```

### CRUD completo com modal

```typescript
import { TableView, ModalForm, ModalFormProvider, useModalForm } from "@discovery-solutions/struct/client";

function UsersTable() {
  const { openModal } = useModalForm();
  
  const columns: ColumnDef<UserInterface>[] = [
    { header: "Nome", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    {
      header: "Ações",
      cell: ({ row }) => (
        <button onClick={() => openModal({ 
          id: row.original._id, 
          modalId: "user-edit" 
        })}>
          Editar
        </button>
      )
    }
  ];
  
  return (
    <>
      <TableView
        endpoint="identity/users"
        columns={columns}
        RightItems={() => (
          <button onClick={() => openModal({ modalId: "user-create" })}>
            Novo Usuário
          </button>
        )}
      />
      
      <ModalForm
        modalId="user-create"
        title="Novo Usuário"
        endpoint="identity/users"
        schema={userCreateSchema}
        fields={userFields}
      />
      
      <ModalForm
        modalId="user-edit"
        title="Editar Usuário"
        endpoint="identity/users"
        schema={userUpdateSchema}
        fields={userFields}
      />
    </>
  );
}

export default function UsersPage() {
  return (
    <ModalFormProvider>
      <UsersTable />
    </ModalFormProvider>
  );
}
```

### Com renderização customizada (asChild)

```typescript
<TableView
  endpoint="identity/users"
  columns={userColumns}
  asChild={true}
/>
```

Quando `asChild={true}`, o TableView apenas gerencia os dados e você controla totalmente a UI.

## Comportamento automático

### Paginação
- Faz requisições com `?page=X&limit=Y`
- Mostra controles de navegação
- Atualiza URL com query params

### Ordenação
- Adiciona `?sort=campo` ou `?sort=-campo`
- Clique na coluna para ordenar
- Indicador visual de ordenação

### Loading states
- Mostra loader durante fetch
- Mostra skeleton durante loading
- Tratamento de erro automático

### Refresh automático
- Usa TanStack Query para cache
- Atualiza ao criar/editar via ModalForm
- Invalida queries relacionadas

## Dicas
- Defina colunas em arquivos separados (`schema.ts`)
- Use `LeftItems` e `RightItems` para header customizado
- Combine com `ModalForm` para CRUD completo
- Use `asChild` para controle total da UI
- Configure `pageSize` conforme necessidade
- Adicione coluna de ações para edit/delete
