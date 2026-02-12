# Skill: ModalForm - Formulários em Modal

## Descrição
`ModalForm` é um componente React do `@discovery-solutions/struct` que cria formulários dentro de um modal/dialog. É perfeito para operações rápidas de create/edit sem sair da página atual. Usa o `ModelForm` internamente.

## Quando usar
- Criar/editar registros sem sair da página
- Formulários rápidos em tabelas ou listas
- Manter o contexto visual do usuário
- Múltiplos formulários na mesma página

## Como usar

### Import
```typescript
import { ModalForm, ModalFormProvider, useModalForm } from "@discovery-solutions/struct/client";
```

### Props disponíveis
```typescript
interface ModalFormProps {
  modalId: string;
  endpoint: string;
  schema: ZodSchema;
  fields: FieldInterface[];
  title?: string;
  mode?: "register" | "edit";
  cols?: number;
  buttonLabel?: string | boolean;
  mutationParams?: Record<string, any>;
  parseFetchedData?: (data: any) => Promise<any>;
  onSuccess?: (response: any) => any;
}
```

## Setup básico

### 1. Envolver com Provider

```typescript
import { ModalFormProvider } from "@discovery-solutions/struct/client";

export default function UsersPage() {
  return (
    <ModalFormProvider>
      {/* Seu conteúdo aqui */}
    </ModalFormProvider>
  );
}
```

### 2. Adicionar o ModalForm

```typescript
import { ModalFormProvider, ModalForm } from "@discovery-solutions/struct/client";
import { userFields, userCreateSchema } from "@/models/identity/user/schema";

export default function UsersPage() {
  return (
    <ModalFormProvider>
      <ModalForm
        modalId="user-form"
        title="Novo Usuário"
        endpoint="identity/users"
        schema={userCreateSchema}
        fields={userFields}
        buttonLabel="Cadastrar"
        cols={2}
      />
      
      {/* Seu conteúdo de listagem aqui */}
    </ModalFormProvider>
  );
}
```

### 3. Abrir o modal

```typescript
import { useModalForm } from "@discovery-solutions/struct/client";

function UsersList() {
  const { openModal } = useModalForm();
  
  return (
    <button onClick={() => openModal({ modalId: "user-form" })}>
      Novo Usuário
    </button>
  );
}
```

## Exemplos de uso

### Modal para criar

```typescript
import { ModalFormProvider, ModalForm, useModalForm } from "@discovery-solutions/struct/client";
import { userFields, userCreateSchema } from "@/models/identity/user/schema";

function UsersList() {
  const { openModal } = useModalForm();
  
  return (
    <div>
      <button onClick={() => openModal({ modalId: "user-create" })}>
        Adicionar Usuário
      </button>
      
      <ModalForm
        modalId="user-create"
        title="Novo Usuário"
        endpoint="identity/users"
        schema={userCreateSchema}
        fields={userFields}
        cols={2}
      />
    </div>
  );
}

export default function UsersPage() {
  return (
    <ModalFormProvider>
      <UsersList />
    </ModalFormProvider>
  );
}
```

### Modal para editar

```typescript
function UsersList() {
  const { openModal } = useModalForm();
  const users = [...]; // seus dados
  
  return (
    <div>
      {users.map(user => (
        <div key={user._id}>
          <span>{user.name}</span>
          <button onClick={() => openModal({ 
            id: user._id, 
            modalId: "user-edit" 
          })}>
            Editar
          </button>
        </div>
      ))}
      
      <ModalForm
        modalId="user-edit"
        title="Editar Usuário"
        endpoint="identity/users"
        schema={userUpdateSchema}
        fields={userFields}
      />
    </div>
  );
}
```

### Múltiplos modals na mesma página

```typescript
function Page() {
  const { openModal } = useModalForm();
  
  return (
    <div>
      <button onClick={() => openModal({ modalId: "user-form" })}>
        Novo Usuário
      </button>
      
      <button onClick={() => openModal({ modalId: "enterprise-form" })}>
        Nova Empresa
      </button>
      
      <ModalForm
        modalId="user-form"
        title="Usuário"
        endpoint="identity/users"
        schema={userCreateSchema}
        fields={userFields}
      />
      
      <ModalForm
        modalId="enterprise-form"
        title="Empresa"
        endpoint="identity/enterprises"
        schema={enterpriseCreateSchema}
        fields={enterpriseFields}
      />
    </div>
  );
}

export default function PageWithModals() {
  return (
    <ModalFormProvider>
      <Page />
    </ModalFormProvider>
  );
}
```

### Com valores padrão ao abrir

```typescript
function UsersList() {
  const { openModal } = useModalForm();
  const currentOrg = useCurrentOrg();
  
  return (
    <button onClick={() => openModal({ 
      modalId: "user-form",
      defaultValues: {
        organizationId: currentOrg.id,
        role: "user"
      }
    })}>
      Novo Usuário
    </button>
  );
}
```

### Com callback de sucesso

```typescript
<ModalForm
  modalId="user-form"
  title="Novo Usuário"
  endpoint="identity/users"
  schema={userCreateSchema}
  fields={userFields}
  onSuccess={(response) => {
    console.log("Usuário criado:", response);
    toast.success(`Usuário ${response.name} criado!`);
  }}
/>
```

### Com layout em colunas

```typescript
<ModalForm
  modalId="user-form"
  title="Novo Usuário"
  endpoint="identity/users"
  schema={userCreateSchema}
  fields={userFields}
  cols={2}
/>
```

## Hook useModalForm

### Métodos disponíveis

```typescript
const { openModal, closeModal, open, id, modalId, defaultValues } = useModalForm();
```

#### openModal
Abre um modal específico:
```typescript
openModal({ 
  modalId: "user-form",
  id: "123",
  defaultValues: { role: "admin" }
})
```

#### closeModal
Fecha o modal atual:
```typescript
closeModal()
```

#### open
Boolean indicando se algum modal está aberto

#### id
ID do registro sendo editado (se aplicável)

#### modalId
ID do modal atualmente aberto

#### defaultValues
Valores padrão passados ao abrir o modal

## Integração com TableView

```typescript
import { TableView, ModalForm, ModalFormProvider, useModalForm } from "@discovery-solutions/struct/client";

function UsersTable() {
  const { openModal } = useModalForm();
  
  const columns = [
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

## Comportamento

### Modo automático
Se você passar apenas `modalId`, o modal abre em modo "register".
Se você passar `id` junto com `modalId`, o modal abre em modo "edit".

```typescript
openModal({ modalId: "form" })
openModal({ modalId: "form", id: "123" })
```

### Fechamento automático
O modal fecha automaticamente após sucesso na criação/edição (comportamento do ModelForm interno).

### Estado compartilhado
Todos os componentes dentro do `ModalFormProvider` podem acessar o estado do modal via `useModalForm`.

## Dicas
- Use um `modalId` único para cada modal
- Envolver a página inteira com `ModalFormProvider`
- Combine com `TableView` para CRUD completo
- Use `defaultValues` para pré-preencher campos
- Use `onSuccess` para ações pós-criação/edição
- Configure `cols` para melhor layout
