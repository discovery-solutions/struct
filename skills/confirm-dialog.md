# Skill: ConfirmDialog - Diálogos de Confirmação

## Descrição

`ConfirmDialog` é um componente React do `@discovery-solutions/struct` que exibe um diálogo de confirmação antes de executar ações destructivas ou importantes. Automaticamente executa uma requisição HTTP (DELETE/PATCH/POST) após a confirmação.

## Quando usar

- Confirmação antes de deletar registros
- Ações irreversíveis que precisam de confirmação
- Operações que requerem consentimento do usuário
- Exclusão em cascata ou ações em lote

## Como usar

### Import

```typescript
import {
  ConfirmDialog,
  useConfirmDialog,
} from "@discovery-solutions/struct/client";
```

### Props disponíveis

```typescript
interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string | ReactNode;
  endpoint?: string;
  params?: { id: string };
  method?: "DELETE" | "PATCH" | "POST";
  onSuccess?: () => void;
  onPress?: () => void;
  onError?: (error: any) => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  children?: ReactNode; // trigger custom element
}
```

## Exemplos de uso

### Confirmação simples de delete

```typescript
import { ConfirmDialog } from "@discovery-solutions/struct/client";

export default function UserRow({ user }) {
  return (
    <div className="flex items-center gap-4">
      <span>{user.name}</span>
      <ConfirmDialog
        endpoint="identity/users"
        params={{ id: user._id }}
        title="Deletar Usuário"
        description={`Tem certeza que deseja deletar ${user.name}? Esta ação não pode ser desfeita.`}
        variant="destructive"
      >
        <button className="text-red-600">Deletar</button>
      </ConfirmDialog>
    </div>
  );
}
```

### Com trigger button

```typescript
<ConfirmDialog
  endpoint="identity/users"
  params={{ id: user._id }}
  title="Desativar Usuário"
  description="O usuário não podrá mais acessar o sistema."
  method="PATCH"
  variant="outline"
>
  <button>Desativar</button>
</ConfirmDialog>
```

### Com callback de sucesso

```typescript
<ConfirmDialog
  endpoint="identity/users"
  params={{ id: user._id }}
  onSuccess={() => {
    router.refresh();
    toast.success("Usuário deletado!");
  }}
  onError={(err) => {
    toast.error(err.message);
  }}
>
  <button>Deletar</button>
</ConfirmDialog>
```

### Com ação customizada (onPress)

```typescript
<ConfirmDialog
  title="Confirmar Transferência"
  description="Isso transferirá todos os dados para a nova conta."
  onPress={() => {
    // Custom action instead of API call
    transferData(sourceId, targetId);
  }}
>
  <button>Transferir</button>
</ConfirmDialog>
```

### Controlled mode com useConfirmDialog

```typescript
import { ConfirmDialog, useConfirmDialog } from "@discovery-solutions/struct/client";

function UsersList({ users }) {
  const { open, setOpen, trigger } = useConfirmDialog();
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    trigger();
  };

  return (
    <>
      {users.map(user => (
        <button onClick={() => handleDeleteClick(user)}>
          Deletar
        </button>
      ))}

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        endpoint="identity/users"
        params={{ id: selectedUser?._id }}
        title="Confirmar Exclusão"
        description={`Deletar ${selectedUser?.name}?`}
      />
    </>
  );
}
```

### Com método PATCH (ativar/desativar)

```typescript
<ConfirmDialog
  endpoint="identity/users"
  params={{ id: user._id }}
  method="PATCH"
  title={user.active ? "Desativar Usuário" : "Ativar Usuário"}
  description={user.active
    ? "O usuário será desativado e não poderá acessar o sistema."
    : "O usuário poderá acessar o sistema novamente."
  }
  variant="outline"
>
  <button>{user.active ? "Desativar" : "Ativar"}</button>
</ConfirmDialog>
```

### Múltiplos botões na mesma linha

```typescript
function UserActions({ user }) {
  return (
    <div className="flex gap-2">
      <ConfirmDialog
        endpoint="identity/users"
        params={{ id: user._id }}
        title="Deletar Usuário"
        variant="destructive"
      >
        <button className="btn-sm btn-danger">Deletar</button>
      </ConfirmDialog>

      <ConfirmDialog
        endpoint="identity/users"
        params={{ id: user._id }}
        method="PATCH"
        title="Resetar Senha"
        description="Uma nova senha será enviada por email."
      >
        <button className="btn-sm btn-secondary">Resetar</button>
      </ConfirmDialog>
    </div>
  );
}
```

### Em TableView com ações

```typescript
import { TableView, ConfirmDialog } from "@discovery-solutions/struct/client";

const columns = [
  { header: "Nome", accessorKey: "name" },
  { header: "Email", accessorKey: "email" },
  {
    header: "Ações",
    cell: ({ row }) => (
      <ConfirmDialog
        endpoint="identity/users"
        params={{ id: row.original._id }}
        title="Deletar Usuário"
        description={`Deletar ${row.original.name}?`}
        variant="destructive"
      >
        <button className="text-red-600">Deletar</button>
      </ConfirmDialog>
    )
  }
];

export default function UsersPage() {
  return (
    <TableView endpoint="identity/users" columns={columns} />
  );
}
```

## Hook useConfirmDialog

### Para controlled mode

```typescript
const { open, setOpen, trigger } = useConfirmDialog();
```

- `open`: boolean - estado atual do dialog
- `setOpen`: function - altera o estado
- `trigger`: function - abre o dialog

## Comportamento automático

### Requisição HTTP

- Se `endpoint` informado: faz request automaticamente após confirmar
- URL: `/api/{endpoint}/{params.id}`
- Método padrão: DELETE
- Após sucesso: invalidates queries automaticamente

### Estados

- Loading durante a mutation
- Feedback de erro via toast
- Feedback de sucesso via toast

### Variantes de botão

- `destructive` (padrão): vermelho para ações perigosas
- `outline`: borda apenas
- `secondary`: cinza
- `default`: padrão

## Diferenças entre Trigger Options

### Com children (trigger customizado)

```typescript
<ConfirmDialog endpoint="..." params={{ id: "1" }}>
  <button>Meu botão</button>
</ConfirmDialog>
```

- O children funciona como trigger
- Abre o dialog ao clicar

### Com onPress (ação customizada)

```typescript
<ConfirmDialog onPress={() => minhaFuncao()}>
  <button>Clique</button>
</ConfirmDialog>
```

- Substitui a chamada HTTP automática
- Útil para lógica customizada

## Dicas

- Use `variant="destructive"` para ações irreversíveis
- Customize `title` e `description` para contexto claro
- Use `onSuccess` para refresh de dados ou redirects
- Para ações em lote, use `onPress` com lógica customizada
- Sempre invalid queries após operações de delete/update
