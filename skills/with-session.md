# Skill: withSession - Proteção de rotas e autenticação

## Descrição
`withSession` é uma função higher-order do `@discovery-solutions/struct` que envolve handlers de API routes do Next.js, adicionando automaticamente gerenciamento de sessão, autenticação, controle de acesso baseado em roles (RBAC) e conexão com banco de dados.

## Quando usar
- Proteger rotas de API com autenticação
- Controlar acesso por roles
- Gerenciar conexões de banco de dados automaticamente
- Acessar dados do usuário logado
- Criar endpoints customizados com autenticação

## Como usar

### Import
```typescript
import { withSession } from "@discovery-solutions/struct";
```

### Sintaxe básica
```typescript
export const GET = withSession(async ({ user }, req, context) => {
  return Response.json({ data });
}, { roles: "admin" });
```

## Parâmetros

### Handler function
Recebe 3 argumentos:
1. `{ user }` - Objeto contendo dados do usuário logado
2. `req` - NextRequest object
3. `context` - Contexto da rota (inclui params)

### Options
```typescript
interface Params {
  roles?: string | string[];
  database?: string;
}
```

## Exemplos de uso

### Rota pública (sem autenticação)

```typescript
import { withSession } from "@/struct";

export const GET = withSession(async ({ user }, req) => {
  return Response.json({ message: "Rota pública" });
});
```

### Rota protegida (requer autenticação)

Se você configurou `auth.getSession`, a autenticação é automática:

```typescript
export const GET = withSession(async ({ user }, req) => {
  return Response.json({ 
    message: `Olá ${user.name}!`,
    userId: user.id
  });
});
```

### Com controle de acesso por role

```typescript
export const GET = withSession(async ({ user }, req) => {
  return Response.json({ adminData: [...] });
}, { roles: "admin" });
```

### Múltiplas roles permitidas

```typescript
export const POST = withSession(async ({ user }, req) => {
  const body = await req.json();
  return Response.json({ created: true });
}, { roles: ["admin", "manager"] });
```

### Acesso a qualquer role autenticada

```typescript
export const GET = withSession(async ({ user }, req) => {
  return Response.json({ data: [...] });
}, { roles: "*" });
```

### Acessando params da rota

```typescript
// app/api/users/[id]/route.ts
export const GET = withSession(async ({ user }, req, context) => {
  const { id } = await context.params;
  
  return Response.json({ 
    userId: id,
    requestedBy: user.id 
  });
}, { roles: "admin" });
```

### Com lógica de autorização customizada

```typescript
export const PATCH = withSession(async ({ user }, req, context) => {
  const { id } = await context.params;
  const body = await req.json();
  
  const resource = await Resource.findById(id);
  if (resource.ownerId !== user.id && user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  
  const updated = await Resource.findByIdAndUpdate(id, body, { new: true });
  return Response.json(updated);
}, { roles: "*" });
```

### Multi-tenancy com database específico

```typescript
export const GET = withSession(async ({ user }, req) => {
  return Response.json({ data: [...] });
}, { 
  roles: "admin",
  database: "tenant_123" 
});
```

### Exemplo completo com todos recursos

```typescript
// app/api/reports/[id]/route.ts
import { withSession } from "@/struct";
import { Report } from "@/models/report/model";

export const GET = withSession(async ({ user }, req, context) => {
  const { id } = await context.params;
  const searchParams = req.nextUrl.searchParams;
  const format = searchParams.get("format") || "json";
  
  const report = await Report.findById(id);
  
  if (!report) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  
  if (report.organizationId !== user.organizationId && user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  
  if (format === "pdf") {
    const pdfBuffer = await generatePDF(report);
    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report-${id}.pdf"`
      }
    });
  }
  
  return Response.json(report);
}, { roles: ["admin", "manager"] });

export const DELETE = withSession(async ({ user }, req, context) => {
  const { id } = await context.params;
  
  const report = await Report.findById(id);
  
  if (!report) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  
  if (report.createdBy !== user.id && user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  
  await Report.findByIdAndDelete(id);
  
  return Response.json({ success: true });
}, { roles: ["admin", "manager"] });
```

## Comportamento automático

### Gerenciamento de conexão DB
- Abre conexão antes do handler
- Fecha conexão após o handler (no finally)
- Garante que a conexão sempre é fechada

### Tratamento de erros
- Captura erros de validação Zod
- Captura erros gerais
- Retorna responses formatados

### Autenticação
- Busca sessão automaticamente (se configurado)
- Retorna 401 se usuário não autenticado (quando auth configurado)
- Retorna 403 se role não permitida

## Configuração inicial

Para usar withSession com autenticação, configure no seu arquivo `struct.ts`:

```typescript
import { Struct } from "@discovery-solutions/struct";
import { auth } from "@/auth";

Struct.configure({
  database: {
    startConnection: async () => {
      await connectDB();
    },
    closeConnection: async () => {
      await closeDB();
    }
  },
  auth: {
    getSession: async (req) => {
      return await auth(req);
    }
  }
});
```

## Interface StructUser

Por padrão:
```typescript
type StructUser = {
  id: string;
  email?: string;
  role?: string;
  [key: string]: any;
};
```

Você pode estender:
```typescript
// types/struct.d.ts
declare module "@discovery-solutions/struct" {
  export interface StructUser {
    id: string;
    email: string;
    name: string;
    role: "admin" | "manager" | "user";
    organizationId: string;
  }
}
```

## Dicas
- Use `roles: "*"` para qualquer usuário autenticado
- Use `roles: ["role1", "role2"]` para múltiplas roles
- Sem `roles` + sem `auth.getSession` = rota pública
- Com `auth.getSession` mas sem `roles` = requer autenticação (qualquer role)
- Adicione lógica de autorização customizada dentro do handler
- Acesse `user` para dados do usuário logado
- Use `context.params` para acessar parâmetros da rota
