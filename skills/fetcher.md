# Skill: Fetcher - Requisições HTTP

## Descrição
O `fetcher` é uma função utilitária do `@discovery-solutions/struct` para fazer requisições HTTP com tratamento automático de erros, suporte a diferentes métodos HTTP, e manipulação de FormData e JSON.

## Quando usar
- Fazer requisições GET, POST, PUT, PATCH ou DELETE para APIs
- Enviar dados JSON ou FormData
- Adicionar parâmetros de query string
- Requisições com headers customizados

## Como usar

### Import
```typescript
import { fetcher } from "@discovery-solutions/struct";
```

### Sintaxe básica
```typescript
const data = await fetcher<T>(url, options);
```

### Opções disponíveis
```typescript
type FetcherOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  params?: Record<string, any>;
  body?: any;
  baseUrl?: string;
};
```

## Exemplos de uso

### GET simples
```typescript
const users = await fetcher("/api/users");
```

### GET com parâmetros
```typescript
const users = await fetcher("/api/users", {
  method: "GET",
  params: {
    page: 1,
    limit: 10,
    filter: "active"
  }
});
```

### POST com JSON
```typescript
const newUser = await fetcher("/api/users", {
  method: "POST",
  body: {
    name: "João Silva",
    email: "joao@example.com",
    role: "admin"
  }
});
```

### PUT/PATCH para atualizar
```typescript
const updatedUser = await fetcher("/api/users/123", {
  method: "PATCH",
  body: {
    name: "João Santos"
  }
});
```

### DELETE
```typescript
await fetcher("/api/users/123", {
  method: "DELETE"
});
```

### POST com FormData
```typescript
const formData = new FormData();
formData.append("file", file);
formData.append("name", "documento.pdf");

const response = await fetcher("/api/upload", {
  method: "POST",
  body: formData
});
```

### Com headers customizados
```typescript
const data = await fetcher("/api/users", {
  method: "GET",
  headers: {
    "X-Custom-Header": "valor"
  }
});
```

### Com TypeScript (tipado)
```typescript
interface User {
  _id: string;
  name: string;
  email: string;
}

const user = await fetcher<User>("/api/users/123");
```

## Características importantes

### Tratamento automático de erros
O fetcher lança um erro automaticamente se a resposta não for ok (status >= 400), com a mensagem retornada pela API.

```typescript
try {
  const data = await fetcher("/api/users");
} catch (error) {
  console.error(error.message);
}
```

### Content-Type automático
- Para JSON: `Content-Type: application/json` (automático)
- Para FormData: o navegador define automaticamente o boundary

### Cache desabilitado
Por padrão, o fetcher usa `cache: "no-store"` para sempre buscar dados atualizados.

### Conversão automática
- Se a resposta é JSON, retorna o objeto parseado
- Se não é JSON, retorna o texto

## Uso com TanStack Query

O fetcher é perfeito para usar com React Query:

```typescript
const { data, isLoading } = useQuery({
  queryKey: ["users"],
  queryFn: () => fetcher("/api/users")
});
```

## Uso com mutations

```typescript
const mutation = useMutation({
  mutationFn: (userData) => fetcher("/api/users", {
    method: "POST",
    body: userData
  })
});
```

## Dicas
- Use TypeScript generics para tipar as respostas
- Combine com React Query para cache e sincronização
- Para arquivos, use FormData
- Os parâmetros são automaticamente convertidos em query string
