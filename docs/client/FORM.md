# ModelForm

The **`ModelForm`** is a **generic, dynamic form component** that integrates directly with a backend API and works seamlessly with **StructUIProvider**. It uses:

* `FieldInterface` for field definitions.
* Aliases defined in the `StructUIProvider` to map `type` → component.
* `Zod` for validation.
* `React Query` for fetching and mutating data.

---

## ⚙️ Key Concepts

### Field Aliases

Each `FieldInterface` has a `type` property, e.g.:

```ts
{ name: "avatar", type: "avatar", label: "Foto do usuário" }
```

Struct will **automatically map `type` → UI component** via the `alias` object configured in `StructUIProvider`:

```ts
Struct.alias = {
  avatar: "AvatarUpload",
  text: "Input",
  checkbox: "Checkbox",
  ...
}
```

So `"type": "avatar"` will render your registered `AvatarUpload` component automatically.

---

### Props

| Prop               | Type                       | Description                                                                                                 |
| ------------------ | -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `endpoint`         | `string`                   | API path, e.g., `"users"`; `ModelForm` will call `POST /api/users` or `PATCH /api/users/:id` automatically. |
| `schema`           | `ZodSchema`                | Zod validation schema for submission.                                                                       |
| `fields`           | `FieldInterface[]`         | Defines the fields rendered in the form.                                                                    |
| `mode`             | `"register" \| "edit"`     | Defaults to `"edit"` if `id` exists.                                                                        |
| `defaultValues`    | `Record<string, any>`      | Initial form values if no fetch is needed.                                                                  |
| `onBeforeSubmit`   | `(values) => Promise<any>` | Optional hook to preprocess values before submission.                                                       |
| `onSubmit`         | `(values) => any`          | Optional custom submission handler.                                                                         |
| `onAfterSubmit`    | `(response) => any`        | Hook triggered after successful submission.                                                                 |
| `parseFetchedData` | `(values) => Promise<any>` | Optional parser for fetched API data.                                                                       |
| `buttonLabel`      | `string \| boolean`        | Label for submit button; `false` hides it.                                                                  |
| `cols`             | `number`                   | Grid columns for layout, default 3.                                                                         |

---

### Usage Example

```tsx
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
/>;
```

---

### Features

* **Automatic CRUD integration:** decides `POST` or `PATCH` based on `mode` or `id`.
* **Dynamic rendering:** uses `FieldInterface` + `alias` mapping for flexible UI.
* **Validation:** parses fields via `Zod` before submission.
* **Server-side data fetching:** auto-fetches initial values in `edit` mode.
* **React Query integration:** handles caching, invalidation, loading and errors automatically.
* **Conditional fields:** supports `field.conditional` to hide/show fields dynamically.
* **Nested values:** supports deep objects (`user.address.city`) automatically.