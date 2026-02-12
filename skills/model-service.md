# Skill: ModelService - Operações de banco de dados

## Descrição
`ModelService` é uma classe do `@discovery-solutions/struct` que fornece uma camada de abstração para operações CRUD básicas com modelos Mongoose. É útil para lógica de negócio customizada fora dos controllers automáticos.

## Quando usar
- Criar lógica de negócio customizada
- Operações de banco não cobertas pelo CRUDController
- Services e camadas de aplicação
- Funções utilitárias que precisam acessar dados
- Background jobs e cron jobs

## Como usar

### Import
```typescript
import { ModelService } from "@discovery-solutions/struct";
```

### Criar uma instância
```typescript
const userService = new ModelService<UserInterface>(User);
```

## Métodos disponíveis

### findOne
Busca um único documento por query:

```typescript
async findOne(query: FilterQuery<T>): Promise<T | null>
```

Exemplo:
```typescript
const user = await userService.findOne({ email: "john@example.com" });
```

### findById
Busca um documento por ID com suporte a populate:

```typescript
async findById(id: string, populate?: string[]): Promise<T | null>
```

Exemplos:
```typescript
const user = await userService.findById("123");

const user = await userService.findById("123", ["enterprise", "createdBy"]);
```

### findMany
Busca múltiplos documentos com suporte a populate:

```typescript
async findMany(query: FilterQuery<T>, populate?: string[]): Promise<T[]>
```

Exemplos:
```typescript
const users = await userService.findMany({ role: "admin" });

const users = await userService.findMany(
  { organizationId: "123" },
  ["enterprise"]
);
```

### create
Cria um novo documento:

```typescript
async create(data: Partial<T>): Promise<T>
```

Exemplo:
```typescript
const newUser = await userService.create({
  name: "John Doe",
  email: "john@example.com",
  role: "user"
});
```

### updateOne
Atualiza um documento por query:

```typescript
async updateOne(query: FilterQuery<T>, updates: UpdateQuery<T>): Promise<T | null>
```

Exemplo:
```typescript
const updated = await userService.updateOne(
  { email: "john@example.com" },
  { $set: { active: true } }
);
```

### updateById
Atualiza um documento por ID:

```typescript
async updateById(id: string, updates: UpdateQuery<T>): Promise<T | null>
```

Exemplo:
```typescript
const updated = await userService.updateById("123", {
  $set: { name: "John Updated" }
});
```

### deleteOne
Deleta um documento por query:

```typescript
async deleteOne(query: FilterQuery<T>): Promise<void>
```

Exemplo:
```typescript
await userService.deleteOne({ email: "john@example.com" });
```

## Exemplos práticos

### Service layer customizado

```typescript
// services/user.service.ts
import { ModelService } from "@discovery-solutions/struct";
import { User, UserInterface } from "@/models/identity/user/model";

export class UserService extends ModelService<UserInterface> {
  constructor() {
    super(User);
  }

  async findActiveUsers() {
    return this.findMany({ active: true, deletedAt: null });
  }

  async findUsersByOrganization(organizationId: string) {
    return this.findMany(
      { organizationId, deletedAt: null },
      ["enterprise"]
    );
  }

  async activateUser(userId: string) {
    return this.updateById(userId, {
      $set: { active: true, activatedAt: new Date() }
    });
  }

  async deactivateUser(userId: string) {
    return this.updateById(userId, {
      $set: { active: false, deactivatedAt: new Date() }
    });
  }

  async softDeleteUser(userId: string) {
    return this.updateById(userId, {
      $set: { deletedAt: new Date() }
    });
  }
}

export const userService = new UserService();
```

### Uso em API routes customizadas

```typescript
// app/api/users/activate/[id]/route.ts
import { withSession } from "@/struct";
import { userService } from "@/services/user.service";

export const POST = withSession(async ({ user }, req, context) => {
  const { id } = await context.params;

  if (user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await userService.activateUser(id);

  if (!updated) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json(updated);
}, { roles: "admin" });
```

### Background jobs

```typescript
// jobs/cleanup-inactive-users.ts
import { ModelService } from "@discovery-solutions/struct";
import { User, UserInterface } from "@/models/identity/user/model";

const userService = new ModelService<UserInterface>(User);

export async function cleanupInactiveUsers() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const inactiveUsers = await userService.findMany({
    lastLoginAt: { $lt: thirtyDaysAgo },
    active: false
  });

  for (const user of inactiveUsers) {
    await userService.updateById(user._id, {
      $set: { deletedAt: new Date() }
    });
    
    console.log(`Soft deleted inactive user: ${user.email}`);
  }

  return inactiveUsers.length;
}
```

### Aggregations complexas

```typescript
// services/analytics.service.ts
import { ModelService } from "@discovery-solutions/struct";
import { User, UserInterface } from "@/models/identity/user/model";

export class AnalyticsService {
  private userService: ModelService<UserInterface>;

  constructor() {
    this.userService = new ModelService<UserInterface>(User);
  }

  async getUserStatsByRole() {
    const users = await this.userService.findMany({ deletedAt: null });
    
    const stats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return stats;
  }

  async getActiveUsersCount() {
    const users = await this.userService.findMany({
      active: true,
      deletedAt: null
    });
    
    return users.length;
  }
}
```

### Validação customizada antes de criar

```typescript
// services/user.service.ts
export class UserService extends ModelService<UserInterface> {
  async createUser(data: Partial<UserInterface>) {
    const existing = await this.findOne({ email: data.email });
    
    if (existing) {
      throw new Error("Email já cadastrado");
    }

    const user = await this.create({
      ...data,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await this.sendWelcomeEmail(user.email);

    return user;
  }

  private async sendWelcomeEmail(email: string) {
    // lógica de envio de email
  }
}
```

## Diferenças entre ModelService e CRUDController

### ModelService
- Uso em qualquer lugar do código
- Controle total das operações
- Sem HTTP/REST
- Para lógica de negócio

### CRUDController
- Apenas em API routes
- Gera endpoints REST automaticamente
- Com autenticação e RBAC
- Para exposição de APIs

## Dicas
- Use ModelService para lógica customizada
- Crie services especializados estendendo ModelService
- Combine com CRUDController para endpoints automáticos + lógica customizada
- Use populate para carregar relacionamentos
- ModelService retorna objetos JavaScript puros (não documentos Mongoose)
- Ideal para background jobs, cron jobs e utilitários
