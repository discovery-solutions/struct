# Skill: SearchHeader - Barra de Busca e Ações

## Descrição

`SearchHeader` é um componente React do `@discovery-solutions/struct` que fornece um header padrão para páginas de listagem com campo de busca e botão "Adicionar Novo". Pode ser usado como composition com outros componentes ou integrado ao TableView/ListView.

## Quando usar

- Páginas de listagem que precisam de busca
- CRUDs que precisam de botão de adicionar
- Header padrão para páginas de administração
- Quando você quer consistência visual entre páginas

## Como usar

### Import

```typescript
import { SearchHeader } from "@discovery-solutions/struct/client";
```

### Props disponíveis

```typescript
interface SearchHeaderProps {
  hideAdd?: boolean;
  asChild?: boolean;
  search?: string;
  onChange: (e: any) => any;
  LeftItems?: React.ReactNode;
  modalId?: string;
  className?: string;
  searchClassName?: string;
}
```

## Exemplos de uso

### Uso básico com TableView

```typescript
import { TableView, SearchHeader } from "@discovery-solutions/struct/client";

export default function UsersPage() {
  const [search, setSearch] = useState("");

  return (
    <>
      <SearchHeader
        search={search}
        onChange={(e) => setSearch(e.target.value)}
        modalId="user-create"
      />
      <TableView
        endpoint="identity/users"
        columns={userColumns}
      />
    </>
  );
}
```

### Escondendo botão adicionar

```typescript
<SearchHeader
  search={search}
  onChange={setSearch}
  hideAdd={true}
/>
```

### Com LeftItems customizado

```typescript
import { SearchHeader } from "@discovery-solutions/struct/client";

function UsersPageHeader() {
  const [search, setSearch] = useState("");

  return (
    <SearchHeader
      search={search}
      onChange={(e) => setSearch(e.target.value)}
      modalId="user-create"
      LeftItems={
        <div className="flex gap-2">
          <button className="btn-secondary">Exportar</button>
          <button className="btn-secondary">Filtros</button>
        </div>
      }
    />
  );
}
```

### Integração com busca via URL params

```typescript
"use client";
import { useSearchParams } from "next/navigation";
import { TableView, SearchHeader } from "@discovery-solutions/struct/client";

export default function UsersPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const handleSearch = (e) => {
    const params = new URLSearchParams(window.location.search);
    if (e.target.value) {
      params.set("search", e.target.value);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <SearchHeader
        search={search}
        onChange={handleSearch}
        modalId="user-create"
      />
      <TableView
        endpoint={`identity/users${search ? `?search=${search}` : ""}`}
        columns={userColumns}
      />
    </>
  );
}
```

### Com className customizado

```typescript
<SearchHeader
  search={search}
  onChange={setSearch}
  modalId="user-create"
  className="mb-6"
  searchClassName="bg-gray-50"
/>
```

### Modo asChild (sem botão adicionar automático)

```typescript
<SearchHeader
  search={search}
  onChange={setSearch}
  asChild={true}
  LeftItems={
    <button onClick={() => openModal({ modalId: "user-create" })}>
      Criar Usuário
    </button>
  }
/>
```

### Com ListView

```typescript
import { ListView, SearchHeader } from "@discovery-solutions/struct/client";

export default function ProductsPage() {
  const [search, setSearch] = useState("");

  return (
    <>
      <SearchHeader
        search={search}
        onChange={(e) => setSearch(e.target.value)}
        modalId="product-create"
      />
      <ListView<Product>
        endpoint={`products${search ? `?search=${search}` : ""}`}
        renderItem={(product) => <ProductCard product={product} />}
        keyExtractor={(p) => p._id}
      />
    </>
  );
}
```

### Layout completo de página

```typescript
"use client";
import { useState } from "react";
import { TableView, ModalForm, ModalFormProvider, SearchHeader } from "@discovery-solutions/struct/client";
import { userColumns, userFields, userCreateSchema } from "@/models/identity/user/schema";

export default function UsersPage() {
  const [search, setSearch] = useState("");

  return (
    <ModalFormProvider>
      <div className="space-y-4">
        <SearchHeader
          search={search}
          onChange={(e) => setSearch(e.target.value)}
          modalId="user-create"
          LeftItems={
            <div className="text-sm text-gray-500">
              Busque por nome ou email
            </div>
          }
        />

        <TableView
          endpoint={`identity/users${search ? `?search=${search}` : ""}`}
          columns={userColumns}
        />
      </div>

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

## Propriedades explicadas

### search

O valor atual do campo de busca. Typically vem de useState ou URL params.

### onChange

Função chamada quando o usuário digita no campo de busca. Tipicamente atualiza state ou URL.

### modalId

ID do modal que será aberto ao clicar em "Adicionar Novo". Requer que o ModalFormProvider esteja no contexto.

### hideAdd

Se `true`, oculta o botão "Adicionar Novo". Útil para páginas apenas de visualização.

### asChild

Se `true`, não renderiza o botão automaticamente. Permite renderizar customizado via LeftItems ou externas.

### LeftItems

Componentes extras que aparecem ao lado do campo de busca. Útil para filtros, botões adicionais, ou informações.

## Comportamento automático

### Campo de busca

- Placeholder: "Pesquisar..."
- Largura máxima: 280px (md:max-w-xs)
- Estilização padrão do StructUI

### Botão adicionar

- Texto: "Adicionar Novo"
- Largura total em mobile, fit em desktop
- Funciona apenas se `modalId` fornecido e ModalFormProvider presente

### Layout

- Mobile: stack vertical
- Desktop: horizontal (busca + botão)
- Gap padrão: 4 (gap-4)

## Dicas

- Use com TableView ou ListView para páginas de CRUD completas
- Combine com `hideAdd={true}` para páginas apenas de listagem
- Use LeftItems para filtros ou ações adicionais
- Para busca com debounce, use onChange com setTimeout
- O botão adicionar requer ModalFormProvider no contexto
