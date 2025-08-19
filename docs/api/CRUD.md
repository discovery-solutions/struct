# CRUDController

The `CRUDController` is a **generic, ready-to-use CRUD layer for Mongoose models** designed for Next.js `app` routes.
It handles all the heavy lifting for common operations (**GET, POST, PATCH, DELETE**) while allowing you to hook into the lifecycle with custom logic.

---

## ✨ Features

* Generic CRUD operations (`findOne`, `list`, `create`, `update`, `delete`).
* Built-in **role-based access** per HTTP method.
* Extensible via **hooks** (`beforeCreate`, `afterUpdate`, `beforeSend`, etc.).
* Optional **soft delete** strategy.
* Request body validation via **Zod schemas**.
* Works seamlessly with Next.js **Route Handlers** (`app/api/.../route.ts`).
* Pagination, filtering, and deep nested filters included.

---

## 📦 Usage

### 1. Define your Mongoose model

```ts
import mongoose from "mongoose";

interface UserInterface {
  _id?: string;
  name: string;
  email: string;
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
}, { timestamps: true });

export const User = mongoose?.models?.User || mongoose.model<UserInterface>("User", UserSchema);
```

---

### 2. Create an Next.js API Route

```ts
// app/api/users/[[...id]]/route.ts
import { User, UserInterface } from "@/models/user";
import { CRUDController } from "@/struct";

export const userController = new CRUDController<UserInterface>(User, {
  softDelete: true,
  roles: {
    GET: "admin",
    POST: "admin",
    PATCH: "admin",
    DELETE: "superadmin"
  }
});
```

That’s it 🚀 Your CRUD endpoints are ready.

---

## ⚙️ Options

The second argument in the constructor (`CRUDOptions<T, U>`) lets you customize behavior.

### Roles

```ts
roles?: {
  GET?: UserRole;
  POST?: UserRole;
  PATCH?: UserRole;
  DELETE?: UserRole;
}
```

* Defines **minimum role required per method**.
* Defaults to `none` if not specified.

---

### Hooks

All hooks are **async** and can modify or intercept data.

```ts
hooks?: {
  beforeGet?: (ctx) => Promise<void>;
  afterGet?: (ctx) => Promise<T | null>;
  beforeCreate?: (ctx) => Promise<Partial<T>>;
  afterCreate?: (ctx) => Promise<void>;
  beforeUpdate?: (ctx) => Promise<Partial<T> | true>;
  afterUpdate?: (ctx) => Promise<void>;
  beforeDelete?: (ctx) => Promise<void>;
  afterDelete?: (ctx) => Promise<void>;
  beforeSend?: (result, ctx) => Promise<any>;
}
```

---

### Validation

You can provide **Zod schemas** to validate incoming requests:

```ts
import { z } from "zod";

createSchema: z.object({
  name: z.string().min(1),
  email: z.string().email(),
}),

updateSchema: z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
}),
```

---

### Other Options

* `populate?: string[]` → define relationships to auto-populate on GET.
* `softDelete?: boolean` → if `true`, documents are never removed, only marked with `deletedAt`.
* `customParser?: (req: NextRequest) => Promise<any>` → override request body parsing.

---

## 🔍 Filtering & Pagination

`GET /api/users?page=2&limit=10&name=Lucas`

* `page` → defaults to `1`
* `limit` → defaults to `0` (no pagination)
* Any query param is treated as a filter.
* Nested filters with dot notation supported: `address.city=NY`
* ObjectId fields (`id`, `_id`) are automatically converted.
* With `softDelete: true`, automatically excludes deleted docs.

Response format (when paginated):

```json
{
  "page": 2,
  "limit": 10,
  "total": 45,
  "totalPages": 5,
  "data": [...]
}
```

If no `page`/`limit` provided, returns just an array of results.

---

## 🧑‍💻 Example With Hooks

```ts
import { User, UserInterface } from "@/models/user";
import { CRUDController } from "@/struct";
import { z } from "zod";

export const userController = new CRUDController<UserInterface>(User, {
  softDelete: true,
  createSchema: z.object({
    name: z.string(),
    email: z.string().email(),
  }),
  hooks: {
    beforeCreate: async ({ user, data }) => {
      if (user.role !== "admin") throw new Error("Unauthorized");
      return { createdBy: user.id };
    },
    afterGet: async ({ result }) => {
      if (Array.isArray(result)) return result.map(r => ({ ...r, secret: undefined }));
      return result ? { ...result, secret: undefined } : null;
    },
  }
});
```

---

## 🔮 Next Steps

* [ModelService](./MODEL-SERVICE.md) → low-level data service used internally.
<!-- * [withSession](./auth.md) → how session and role enforcement work. -->
* [Struct Config](./CONFIG.md) → configuring struct package
