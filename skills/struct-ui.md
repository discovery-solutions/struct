# Skill: StructUI - Provider de Configuração UI

## Descrição

`StructUI` é o sistema de configuração de componentes UI do `@discovery-solutions/struct`. Fornece componentes base (Button, Input, Dialog, etc.), sistema de toast notifications, e alias para mapeamento de tipos de campos. deve ser configurado uma vez no topo da aplicação.

## Quando usar

- Configurar a biblioteca UI base (shadcn/ui, etc.)
- Fornecer sistema de notificações toast global
- Definir mapeamento de tipos de campos para formulários
- Configurar TanStack Query client
- Disponibilizar componentes para todos os componentes Struct

## Como usar

### Import

```typescript
import {
  StructUIProvider,
  useStructUI,
} from "@discovery-solutions/struct/client";
```

### Configuração completa

```typescript
// app/layout.tsx ou providers.tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StructUIProvider, Button, Input, Loader, Dialog, Dropdown, Card, toast } from "@/components/ui"; // seus componentes

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <StructUIProvider
      config={{
        queryClient,
        Button,
        Input,
        Loader,
        Dialog,
        Dropdown,
        Card,
        toast: {
          success: (msg) => toast.success(msg),
          error: (msg) => toast.error(msg),
          info: (msg) => toast.info(msg),
          warning: (msg) => toast.warning(msg),
        },
        alias: {
          text: "Input",
          email: "Input",
          password: "Input",
          number: "Input",
          textarea: "Textarea",
          select: "Select",
          checkbox: "Checkbox",
          switch: "Switch",
          date: "Input",
          file: "Input",
          image: "Input",
          color: "Input",
        }
      }}
    >
      {children}
    </StructUIProvider>
  );
}
```

## Estrutura da Configuração

### queryClient

Instância do TanStack Query Client. Usado para cache e sincronização de dados.

```typescript
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});
```

### Componentes base

```typescript
config={{
  Button: YourButtonComponent,
  Input: YourInputComponent,
  Loader: YourLoaderComponent,
  // ...
}}
```

Componentes necessários:

- `Button` - Botões
- `Input` - Campos de texto
- `Loader` - Spinner de loading
- `Dialog` - Sistema de modais (objeto com Trigger, Root, Content, Header, Title, Description, Footer)
- `Dropdown` - Menus dropdown (objeto com Root, Trigger, Content, Item)
- `Card` - Cards (objeto com Header, Content, Title, Description)

### Sistema de Toast

```typescript
toast: {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  info: (msg) => toast.info?.(msg),      // opcional
  warning: (msg) => toast.warning?.(msg), // opcional
}
```

### Alias de tipos de campos

Mapeia tipos de campos do FieldInterface para componentes reais:

```typescript
alias: {
  text: "Input",
  email: "Input",
  password: "Input",
  number: "Input",
  textarea: "Textarea",
  select: "Select",
  checkbox: "Checkbox",
  switch: "Switch",
  date: "Input",
  time: "Input",
  datetime: "Input",
  file: "Input",
  image: "Input",
  avatar: "Input",
  color: "Input",
  url: "Input",
  phone: "Input",
  currency: "Input",
  modelSelect: "ModelSelect",
  multiselect: "Multiselect",
  tags: "Tags",
  rating: "Rating",
  slider: "Slider",
  richText: "RichText",
  markdown: "Markdown",
  code: "Code",
  json: "Json",
  radio: "Radio",
}
```

## Hook useStructUI

Acesse a configuração em qualquer componente:

```typescript
import { useStructUI } from "@discovery-solutions/struct/client";

function MyComponent() {
  const Struct = useStructUI();

  // Acesse componentes
  return <Struct.Button>Clique</Struct.Button>;

  // Ou acesso direto
  const { Button, Input, toast } = Struct;
}
```

### Desestruturação comum

```typescript
function MyComponent() {
  const { Button, toast, queryClient } = useStructUI();

  toast.success("Operação realizada!");

  return <Button>Enviar</Button>;
}
```

### Com Dialog

```typescript
function MyModal() {
  const { Dialog, Button } = useStructUI();

  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>Abrir Modal</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Título</Dialog.Title>
          <Dialog.Description>Descrição</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={confirmar}>Confirmar</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

## Tipos TypeScript

### StructToast

```typescript
interface StructToast {
  (
    message: string,
    opts?: {
      description?: string;
      action?: { label: string; onClick: () => void };
    },
  ): void;
  success: (message: string, opts?: { description?: string }) => void;
  error: (message: string, opts?: { description?: string }) => void;
  info?: (message: string, opts?: { description?: string }) => void;
  warning?: (message: string, opts?: { description?: string }) => void;
}
```

### StructUIConfig

```typescript
interface StructUIConfig {
  queryClient: QueryClient;
  Button: React.ComponentType<any>;
  Input: React.ComponentType<any>;
  Loader: React.ComponentType<any>;
  Table: { Root; Header; Body; Row; Head; Cell };
  Card: { Header; Content; Title; Description };
  Dialog: { Trigger; Root; Content; Header; Title; Description; Footer };
  Dropdown: { Root; Trigger; Content; Item };
  toast: StructToast;
  alias: Record<string, string>;
  [key: string]: any;
}
```

## Exemplo com shadcn/ui

```typescript
// providers.tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "sonner"; // ou seu lib de toast
import { StructUIProvider } from "@discovery-solutions/struct/client";
import * as UI from "@/components/ui"; // seus componentes shadcn

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <StructUIProvider
        config={{
          queryClient,
          Button: UI.Button,
          Input: UI.Input,
          Loader: UI.Spinner,
          Table: UI.Table,
          Card: UI.Card,
          Dialog: UI.Dialog,
          Dropdown: UI.DropdownMenu,
          toast: {
            success: (msg, opts) => toast.success(msg, opts),
            error: (msg, opts) => toast.error(msg, opts),
          },
          alias: {
            text: "Input",
            email: "Input",
            // ... mapeie conforme seus componentes
          }
        }}
      >
        {children}
        <Toaster />
      </StructUIProvider>
    </QueryClientProvider>
  );
}
```

## Erro comum

Se você ver:

```
Error: StructUIProvider não foi configurado
```

Significa que você está usando um componente que depende do StructUI (como ModalForm, TableView, FieldRender) sem ter envolveu a aplicação com StructUIProvider.

## Comportamento automático

### QueryClientProvider

- StructUIProvider já envolve TanStack Query automaticamente
- Não precisa de QueryClientProvider separado

### acesso global

- useStructUI funciona em qualquer componente filho
- Não precisa de context providers extras

### Toast automático

- Componentes como ModelForm, ConfirmDialog usam toast automaticamente
- Você também pode usar via useStructUI().toast

## Dicas

- Configure uma única vez no layout raiz
- Reutilize a mesma instância de queryClient
- Mapeie todos os tipos de campos que você usa
- Para novos tipos de campo, adicione no alias
- Use toast no onSuccess/onError de mutations
- Confirme se seus componentes seguem a API esperada (ex: Dialog tem Trigger, Content, etc.)
