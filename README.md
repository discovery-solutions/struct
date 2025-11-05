# @discovery-solutions/struct

A structured framework for building forms, CRUDs, and admin interfaces with Next.js, React Hook Form, Zod, TanStack Query, and TailwindCSS. The goal is to provide a consistent way to define UI elements and data workflows while keeping the UI layer customizable through an injected `StructUIProvider`.

## 🚀 Key Features

- **UI Agnostic** → works with ShadCN, Radix, or any custom design system
- **Structured CRUDs** → generate list, detail, and edit views with minimal boilerplate
- **Forms with Validation** → powered by react-hook-form + zod
- **Async Data Management** → built on top of @tanstack/react-query
- **Composable** → all building blocks are exposed, no hidden magic
- **Type-Safe** → full TypeScript support with generic types
- **Flexible Hooks** → lifecycle hooks for custom business logic
- **Soft Delete Support** → optional soft delete strategy for data preservation
- **Role-Based Access** → built-in RBAC per HTTP method

---

## 📦 Installation

### Dependencies

First, install the required peer dependencies:

```bash
npm i lucide-react @tanstack/react-query zod sonner mongoose class-variance-authority
# or
yarn add lucide-react @tanstack/react-query zod sonner mongoose class-variance-authority
# or
pnpm add lucide-react @tanstack/react-query zod sonner mongoose class-variance-authority
```

### Main Package

Install the struct package from GitHub:

```bash
npm install github:discovery-solutions/struct
# or
yarn add github:discovery-solutions/struct
# or
pnpm add github:discovery-solutions/struct
```

---

## 🛠️ Configuration

### 1. Create a Bootstrap File

Create a `struct.ts` file at the root of your project (`/src` or `/`):

```typescript
// struct.ts
import { connectDB } from "@/lib/mongo";
import { Struct } from "@discovery-solutions/struct";

// Re-export everything from the package
export * from "@discovery-solutions/struct";

Struct.configure({
  database: {
    startConnection: connectDB,
  },
  // Optional auth integration
  // auth: {
  //   getSession: async () => null,
  //   getUser: async () => null,
  // },
});
```

**Important:** Always import from this file instead of the raw package:

```typescript
// ✅ Good
import { Struct } from "@/struct";

// ❌ Avoid
import { Struct } from "@discovery-solutions/struct";
```

### 2. Configure Next.js

Update your `next.config.js` to transpile the package:

```javascript
import { type NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@discovery-solutions/struct" // Required for Tailwind + bundling
  ],
  webpack(config) {
    // Optional: extra Webpack aliases
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
};

export default nextConfig;
```

### 3. Extend StructUser (Optional)

You can extend the default `StructUser` type to include custom roles or permissions:

```typescript
// types/struct.d.ts
import type { StructUser as BaseUser } from "@discovery-solutions/struct";

declare module "@discovery-solutions/struct" {
  export interface StructUser extends BaseUser {
    role: "admin" | "user" | "superadmin";
    permissions?: string[];
  }
}
```

---

## 📖 Core Concepts

### CRUDController

The `CRUDController` is a generic, ready-to-use CRUD layer for Mongoose models designed for Next.js app routes. It handles all the heavy lifting for common operations (GET, POST, PATCH, DELETE) while allowing you to hook into the lifecycle with custom logic.

#### Features

- Generic CRUD operations (findOne, list, create, update, delete)
- Built-in role-based access per HTTP method
- Extensible via hooks (beforeCreate, afterUpdate, beforeSend, etc.)
- Optional soft delete strategy
- Request body validation via Zod schemas
- Works seamlessly with Next.js Route Handlers
- Pagination, filtering, and deep nested filters included

#### Basic Usage

**1. Define your Mongoose model:**

```typescript
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

**2. Create a Next.js API Route:**

```typescript
// app/api/identity/users/[[...id]]/route.ts
import { User, UserInterface } from "@/models/identity/user";
import { CRUDController } from "@/struct";

export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User, {
  softDelete: true,
  roles: {
    GET: "admin",
    POST: "admin",
    PATCH: "admin",
    DELETE: "superadmin"
  }
});
```

That's it! 🚀 Your CRUD endpoints are ready.

#### Options

The second argument in the constructor (`CRUDOptions<T, U>`) lets you customize behavior:

**Roles:**

```typescript
roles?: {
  GET?: UserRole;
  POST?: UserRole;
  PATCH?: UserRole;
  DELETE?: UserRole;
}
```

**Hooks:**

All hooks are async and can modify or intercept data:

```typescript
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

**Validation:**

```typescript
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

**Other Options:**

- `populate?: string[]` → define relationships to auto-populate on GET
- `softDelete?: boolean` → if true, documents are never removed, only marked with deletedAt
- `customParser?: (req: NextRequest) => Promise<any>` → override request body parsing

#### Filtering & Pagination

```
GET /api/identity/users?page=2&limit=10&name=Lucas
```

- `page` → defaults to 1
- `limit` → defaults to 0 (no pagination)
- Any query param is treated as a filter
- Nested filters with dot notation supported: `address.city=NY`
- ObjectId fields (id, _id) are automatically converted
- With `softDelete: true`, automatically excludes deleted docs

**Response format (when paginated):**

```json
{
  "page": 2,
  "limit": 10,
  "total": 45,
  "totalPages": 5,
  "data": [...]
}
```

If no page/limit provided, returns just an array of results.

#### Example With Hooks

```typescript
import { User, UserInterface } from "@/models/identity/user";
import { CRUDController } from "@/struct";
import { z } from "zod";

export const { GET, POST, PATCH, DELETE } = new CRUDController<UserInterface>(User, {
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

### ModelService

The `ModelService` is a lightweight abstraction over Mongoose models, providing generic CRUD operations with typed support. It is designed to work standalone or as the backend layer for `CRUDController`.

#### Purpose

Mongoose is powerful but often verbose and repetitive when writing controllers. ModelService helps by:

- Wrapping common queries in reusable, typed methods
- Normalizing results with `parseEntityToObject`
- Providing consistency across models
- Acting as the foundation for CRUDController

#### Usage

```typescript
import { User, UserInterface } from "@/models/identity/user";
import { ModelService } from "@/struct";

const userService = new ModelService<UserInterface>(User);

// Fetch user
const user = await userService.findOne({ email: "john@example.com" });
```

#### API Reference

| Method | Description |
|--------|-------------|
| `findOne(query, ...args)` | Finds a single document by a MongoDB query |
| `findById(id, populate?)` | Finds a document by ID. Supports populate |
| `findMany(query?)` | Finds multiple documents by query |
| `create(data)` | Creates and saves a new document |
| `updateOne(query, updates)` | Updates the first document matching a query |
| `updateById(id, updates)` | Updates a document by its _id |
| `deleteOne(query)` | Deletes a single document matching the query |

---

## 🎨 Client Components

### TableView

The `TableView` component is a flexible, client-side data table for listing items fetched from a backend API.

#### Features

- Searchable: Typing in the SearchHeader filters rows client-side
- Dynamic Actions: Edit and delete actions are fully customizable
- Loading States: Shows a loader while data is loading
- Empty State: Displays a default message if no items are found
- Reactivity: Any changes automatically update the table
- UI-Agnostic: Uses components from your StructUIProvider
- Flexible Layout: Works in standard list pages or as a child component

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `any[]` | Columns definition for the table |
| `endpoint` | `string` | API path for fetching table data |
| `hideAdd` | `boolean` | If true, hides the "Add new" button |
| `asChild` | `boolean` | If true, edit actions open modals instead of redirecting |
| `queryParams` | `Record<string, any>` | Optional query parameters |
| `LeftItems` | `ReactNode` | Custom content in the left side of the header |
| `ListHeaderComponent` | `ReactNode` | Optional component replacing the default header |
| `ListEmptyComponent` | `ReactNode` | Component to render when the table is empty |
| `ListFooterComponent` | `ReactNode` | Optional footer component |

#### Usage Example

```typescript
import { TableView } from "@discovery-solutions/struct/client";
import { columns } from "./columns";

<TableView
  endpoint="users"
  columns={columns}
  asChild={true}
  LeftItems={<button className="btn">Custom Action</button>}
  ListFooterComponent={<div>Total users: 120</div>}
/>
```

**Columns definition:**

```typescript
export const columns = [
  { header: "Nome", accessorKey: "name" },
  { header: "Email", accessorKey: "email" },
  {
    header: "Status",
    cell: ({ row }) => <span>{row.original.active ? "Ativo" : "Inativo"}</span>
  },
];
```

---

### ListView

The `ListView` component is a flexible, generic list/grid renderer that works with either local data or data fetched from a backend API.

#### Features

- Flexible Layouts: Render rows, grids, or cards
- Client-Side Filtering: Search items by any property
- Integrated Loading/Error States
- Empty State: Default message or fully customizable component
- Header/Footer: Easily replace default header
- Custom Separators: Render between items
- Composable: Can be used standalone or nested

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `T[]` | Optional static array of items |
| `endpoint` | `string` | Optional API path for fetching data |
| `queryParams` | `any` | Optional query parameters |
| `filters` | `{ search?: string }` | Optional filter object |
| `renderItem` | `(item: T, index: number) => ReactNode` | Required. Renders each item |
| `keyExtractor` | `(item: T, index: number) => string \| number` | Optional. Generates unique keys |
| `ListHeaderComponent` | `ReactNode` | Optional component replacing default header |
| `ListEmptyComponent` | `ReactNode` | Rendered when there are no items |
| `ListFooterComponent` | `ReactNode` | Rendered below the list |
| `ItemSeparatorComponent` | `ReactNode` | Rendered between items |

#### Usage Example

```typescript
import { ListView } from "@discovery-solutions/struct/client";

interface Product {
  id: string;
  name: string;
  price: number;
}

<ListView<Product>
  endpoint="products"
  renderItem={(product) => (
    <div className="card">
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  )}
  keyExtractor={(p) => p.id}
  ListFooterComponent={<div>Total products: 12</div>}
/>
```

---

### ModelForm

The `ModelForm` is a generic, dynamic form component that integrates directly with a backend API.

#### Features

- Automatic CRUD integration: decides POST or PATCH based on mode or id
- Dynamic rendering: uses FieldInterface + alias mapping for flexible UI
- Validation: parses fields via Zod before submission
- Server-side data fetching: auto-fetches initial values in edit mode
- React Query integration: handles caching, invalidation, loading and errors
- Conditional fields: supports field.conditional to hide/show fields dynamically
- Nested values: supports deep objects (user.address.city) automatically

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `endpoint` | `string` | API path, e.g., "users" |
| `schema` | `ZodSchema` | Zod validation schema |
| `fields` | `FieldInterface[]` | Defines the fields rendered in the form |
| `mode` | `"register" \| "edit"` | Defaults to "edit" if id exists |
| `defaultValues` | `Record<string, any>` | Initial form values |
| `onBeforeSubmit` | `(values) => Promise<any>` | Optional hook to preprocess values |
| `onSubmit` | `(values) => any` | Optional custom submission handler |
| `onAfterSubmit` | `(response) => any` | Hook triggered after successful submission |
| `parseFetchedData` | `(values) => Promise<any>` | Optional parser for fetched API data |
| `buttonLabel` | `string \| boolean` | Label for submit button; false hides it |
| `cols` | `number` | Grid columns for layout, default 3 |

#### Usage Example

```typescript
import { ModelForm } from "@discovery-solutions/struct/client";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  avatar: z.string().optional(),
});

const fields = [
  { name: "name", type: "text", label: "Nome", required: true },
  { name: "email", type: "text", label: "Email", required: true },
  { name: "avatar", type: "avatar", label: "Foto do perfil" },
];

<ModelForm
  endpoint="users"
  schema={schema}
  fields={fields}
  mode="register"
  onAfterSubmit={(res) => console.log("Created user:", res)}
/>
```

---

### ModalForm

The `ModalForm` is a dynamic form modal integrated with StructUIProvider and React Query.

#### Features

- Automatic mode detection (create vs edit)
- Zod validation applied client-side before mutation
- API integration with automatic create/update calls
- React Query support — queries invalidated after mutation
- Composable forms — define fields once, reuse anywhere
- Programmatic control via hook (useModalForm)

#### Usage

**Wrap your app with the provider:**

```typescript
<ModalFormProvider>
  <TableView ... />
  <ModalForm ... />
</ModalFormProvider>
```

**Basic Create Modal:**

```typescript
<ModalFormProvider>
  <ModalForm
    title="Add Question"
    endpoint="profiling/question"
    schema={questionFormSchema}
    fields={questionFields}
    mutationParams={{ scope: { type: "sector", id } }}
    buttonLabel="Save Question"
    cols={2}
    onSuccess={() => console.log("Created successfully!")}
  />
</ModalFormProvider>
```

**Edit Mode via Hook:**

```typescript
function Example() {
  const { openModal } = useModalForm();

  return (
    <>
      <button onClick={() => openModal({ id: "123" })}>
        Edit Question
      </button>

      <ModalForm
        title="Edit Question"
        endpoint="profiling/question"
        schema={questionFormSchema}
        fields={questionFields}
        buttonLabel="Update"
      />
    </>
  );
}
```

---

### ConfirmDialog

The `ConfirmDialog` is a flexible, reusable confirmation modal that integrates seamlessly with StructUIProvider and React Query.

#### Features

- API integration: automatically executes the defined HTTP method
- Toast notifications: shows success/error messages automatically
- React Query integration: invalidates all queries on success
- Custom triggers: supports inline triggers as child or external control via hook
- Loader support: displays loader while mutation is pending
- Flexible usage: can be controlled or uncontrolled

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Optional controlled open state |
| `onOpenChange` | `(open: boolean) => void` | Optional callback when modal state changes |
| `title` | `string` | Dialog title |
| `description` | `string` | Dialog description |
| `endpoint` | `string` | Optional API endpoint for the action |
| `params` | `{ id: string }` | Optional parameters for the API call |
| `method` | `"DELETE" \| "PATCH" \| "POST"` | HTTP method. Defaults to "DELETE" |
| `onSuccess` | `() => void` | Callback executed after success |
| `onPress` | `() => void` | Optional custom action handler |
| `onError` | `(error: any) => void` | Callback executed if the API call fails |
| `variant` | `string` | Button variant. Defaults to "destructive" |
| `children` | `ReactNode` | Optional trigger element |

#### Usage Examples

**Inline Trigger:**

```typescript
<ConfirmDialog
  endpoint="users"
  params={{ id: "123" }}
>
  <button className="btn-destructive">Delete User</button>
</ConfirmDialog>
```

**Hook-Controlled:**

```typescript
const { open, setOpen, trigger } = useConfirmDialog();

<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  endpoint="users"
  params={{ id: "123" }}
/>

<button onClick={trigger}>Delete User</button>
```

**Custom onPress:**

```typescript
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  onPress={() => console.log("Custom action executed!")}
>
  <button className="btn">Do Something</button>
</ConfirmDialog>
```

---

## 🔧 Utilities

### withSession

A higher-order function that wraps API route handlers with authentication and database connection logic.

```typescript
import { withSession } from "@/struct";

export const GET = withSession(async ({ user }, req, context) => {
  // Your logic here
  return Response.json({ user });
}, { roles: "admin" });
```

### parseEntityToObject

Converts Mongoose documents to plain JavaScript objects:

```typescript
import { parseEntityToObject } from "@/struct";

const plainUser = parseEntityToObject(mongooseUser);
```

---

## 📚 Type Definitions

### StructUser

```typescript
export type StructUser = {
  id: string;
  email?: string;
  role?: string;
  [key: string]: any;
};
```

### FieldInterface

```typescript
export interface FieldInterface {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  conditional?: (values: any) => boolean;
  options?: Array<{ label: string; value: any }>;
  [key: string]: any;
}
```

### CRUDOptions

```typescript
export interface CRUDOptions<T, U extends StructUser = StructUser> {
  populate?: (keyof T)[] | any;
  createSchema?: z.infer<any>;
  updateSchema?: z.infer<any>;
  hooks?: Hooks<T, U>;
  softDelete?: boolean;
  customParser?: (req: NextRequest) => Promise<Partial<T>>;
  roles?: Partial<Record<"GET" | "POST" | "PATCH" | "DELETE", string | string[]>>;
  sort?: Record<string, 1 | -1> | string[];
}
```

---

## 🎯 Best Practices

1. **Always use the configured Struct instance** from your `struct.ts` file
2. **Define Zod schemas** for all forms to ensure type safety and validation
3. **Use hooks** to inject custom business logic without modifying core functionality
4. **Leverage soft delete** for data preservation and audit trails
5. **Implement role-based access** to secure your endpoints
6. **Use TypeScript** to get full type inference and autocomplete
7. **Keep your UI components** in the StructUIProvider for consistency
8. **Use React Query** for efficient data fetching and caching

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests if applicable
5. Submit a pull request

---

## 📄 License

This project is proprietary software owned by Discovery Solutions.

---

## 🆘 Support

For issues, questions, or feature requests, please contact the Discovery Solutions team or open an issue in the repository.

---

## 🔗 Related Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Mongoose](https://mongoosejs.com/)
- [TailwindCSS](https://tailwindcss.com/)

---

Made with ❤️ by Discovery Solutions