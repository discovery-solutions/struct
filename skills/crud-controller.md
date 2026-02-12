# Skill: CRUDController - Endpoints CRUD automáticos

## Descrição
`CRUDController` é uma classe do `@discovery-solutions/struct` que gera automaticamente endpoints REST completos (GET, POST, PATCH, DELETE) para seus modelos Mongoose com suporte a paginação, filtros, soft delete, validação Zod, hooks de lifecycle e controle de acesso baseado em roles.

## Quando usar
- Criar APIs REST para modelos Mongoose
- Endpoints com paginação e filtros automáticos
- CRUD com validação Zod
- Controle de acesso por role
- Soft delete
- Hooks de lifecycle (beforeCreate, afterGet, etc)

## Como usar

### Import
```typescript
import { CRUDController } from "@discovery-solutions/struct";
```

### Estrutura básica
```typescript
export const { GET, POST, PATCH, DELETE } = new CRUDController<T>(Model, options);
```

## Configuração básica

### Endpoint simples

```typescript
// app/api/users/[[...id]]/route.ts
import { User, UserInterface } from "@/models/identity/user/model";
import { CRUDController } from "@/struct";

export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User);
```

Isso cria automaticamente:
- `GET /api/users` - Listar todos
- `GET /api/users/:id` - Buscar por ID
- `POST /api/users` - Criar novo
- `PATCH /api/users/:id` - Atualizar
- `DELETE /api/users/:id` - Deletar

## Opções disponíveis

```typescript
interface CRUDOptions<T> {
  populate?: string[];
  createSchema?: ZodSchema;
  updateSchema?: ZodSchema;
  hooks?: Hooks<T>;
  softDelete?: boolean;
  customParser?: (req: NextRequest) => Promise<Partial<T>>;
  roles?: {
    GET?: string | string[];
    POST?: string | string[];
    PATCH?: string | string[];
    DELETE?: string | string[];
  };
  sort?: Record<string, 1 | -1>;
}
```

## Exemplos de uso

### Com validação Zod

```typescript
import { User, UserInterface, userCreateSchema, userUpdateSchema } from "@/models/identity/user/model";
import { CRUDController } from "@/struct";

export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User, {
  createSchema: userCreateSchema,
  updateSchema: userUpdateSchema
});
```

### Com Soft Delete

```typescript
export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User, {
  softDelete: true,
  createSchema: userCreateSchema,
  updateSchema: userUpdateSchema
});
```

Com soft delete:
- DELETE marca o registro com `deletedAt`
- GET automaticamente exclui registros deletados

### Com controle de acesso (RBAC)

```typescript
export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User, {
  roles: {
    GET: "*",
    POST: "admin",
    PATCH: ["admin", "manager"],
    DELETE: "admin"
  }
});
```

### Com populate (relacionamentos)

```typescript
export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User, {
  populate: ["enterprise", "createdBy"]
});
```

### Com ordenação padrão

```typescript
export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User, {
  sort: { createdAt: -1 }
});
```

## Hooks de Lifecycle

### beforeCreate
Executado antes de criar um registro:

```typescript
export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User, {
  hooks: {
    beforeCreate: async ({ user, data }) => {
      return {
        ...data,
        createdBy: user.id,
        organizationId: user.organizationId
      };
    }
  }
});
```

### afterCreate
Executado após criar um registro:

```typescript
export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User, {
  hooks: {
    afterCreate: async ({ user, created }) => {
      await sendWelcomeEmail(created.email);
      await logAudit("USER_CREATED", { userId: created._id });
    }
  }
});
```

### beforeGet
Executado antes de buscar dados:

```typescript
export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User, {
  hooks: {
    beforeGet: async ({ user, query }) => {
      if (user.role !== "admin") {
        query.organizationId = user.organizationId;
      }
    }
  }
});
```

### afterGet
Executado após buscar dados:

```typescript
export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User, {
  hooks: {
    afterGet: async ({ result }) => {
      if (Array.isArray(result)) {
        return result.map(r => ({ ...r, password: undefined }));
      }
      return result ? { ...result, password: undefined } : null;
    }
  }
});
```

### beforeUpdate
Executado antes de atualizar:

```typescript
export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User, {
  hooks: {
    beforeUpdate: async ({ user, data, id }) => {
      if (user.role !== "admin" && data.role) {
        throw new Error("Apenas admins podem alterar roles");
      }
      return { ...data, updatedBy: user.id };
    }
  }
});
```

### afterUpdate
Executado após atualizar:

```typescript
export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User, {
  hooks: {
    afterUpdate: async ({ updated }) => {
      await invalidateUserCache(updated._id);
    }
  }
});
```

### beforeDelete
Executado antes de deletar:

```typescript
export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User, {
  hooks: {
    beforeDelete: async ({ user, id }) => {
      const userToDelete = await User.findById(id);
      if (userToDelete.role === "admin" && user.role !== "superadmin") {
        throw new Error("Apenas superadmins podem deletar admins");
      }
    }
  }
});
```

### afterDelete
Executado após deletar:

```typescript
export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User, {
  hooks: {
    afterDelete: async ({ id }) => {
      await deleteUserFiles(id);
      await logAudit("USER_DELETED", { userId: id });
    }
  }
});
```

## Recursos automáticos do GET

### Paginação
```
GET /api/users?page=1&limit=10
```

Response:
```json
{
  "page": 1,
  "limit": 10,
  "total": 50,
  "totalPages": 5,
  "data": [...]
}
```

### Ordenação
```
GET /api/users?sort=name
GET /api/users?sort=-createdAt
GET /api/users?sort=name,-createdAt
```

### Filtros
```
GET /api/users?role=admin&active=true
GET /api/users?organizationId=123
```

### Buscar por ID
```
GET /api/users/123
```

## Exemplo completo

```typescript
// app/api/identity/users/[[...id]]/route.ts
import { User, UserInterface, userCreateSchema, userUpdateSchema } from "@/models/identity/user/model";
import { CRUDController } from "@/struct";

export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User, {
  softDelete: true,
  createSchema: userCreateSchema,
  updateSchema: userUpdateSchema,
  populate: ["enterprise"],
  sort: { createdAt: -1 },
  roles: {
    GET: "*",
    POST: ["admin", "manager"],
    PATCH: ["admin", "manager"],
    DELETE: "admin"
  },
  hooks: {
    beforeCreate: async ({ user, data }) => {
      return {
        ...data,
        createdBy: user.id,
        organizationId: user.organizationId
      };
    },
    afterGet: async ({ result }) => {
      if (Array.isArray(result)) {
        return result.map(r => ({ ...r, password: undefined }));
      }
      return result ? { ...result, password: undefined } : null;
    },
    beforeUpdate: async ({ user, data }) => {
      if (user.role !== "admin" && data.role) {
        throw new Error("Sem permissão para alterar role");
      }
      return { ...data, updatedBy: user.id };
    },
    beforeDelete: async ({ user, id }) => {
      const userToDelete = await User.findById(id);
      if (userToDelete.role === "admin" && user.role !== "superadmin") {
        throw new Error("Sem permissão para deletar admin");
      }
    }
  }
});
```

## Dicas
- Use `softDelete: true` para preservar dados
- Defina `roles` para cada método HTTP
- Use `beforeCreate` para adicionar dados automáticos (createdBy, timestamps)
- Use `afterGet` para remover campos sensíveis (password, tokens)
- Use `populate` para carregar relacionamentos automaticamente
- Combine com ModelForm/ModalForm no frontend para CRUD completo
