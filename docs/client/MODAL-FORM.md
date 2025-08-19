# ModalForm

The **`ModalForm`** is a **dynamic form modal** integrated with **StructUIProvider** and **React Query**.
It allows you to **create and edit records** in a fully declarative way, powered by:

* **Zod schemas** for validation
* **Declarative field definitions** (`fields`)
* **Automatic API integration** (create/update)
* **React Query integration** with cache invalidation
* **External control** via `useModalForm` hook

---

## ⚙️ Key Concepts

### Provider & Context

`ModalForm` requires being wrapped by the **`ModalFormProvider`**.
The provider exposes context and hooks for **programmatic control**.

```tsx
<ModalFormProvider>
  <TableView ... />
  <ModalForm ... />
</ModalFormProvider>
```

Inside the provider, you can call `useModalForm()` to open/close the modal programmatically:

```ts
const { openModal, closeModal } = useModalForm();
openModal({ id: "123" }); // edit mode
openModal(); // create mode
```

---

### Create vs Edit

* If `id` is passed (`openModal({ id })`), the modal automatically switches to **edit mode**.
* If not, it defaults to **create mode**.
* Title defaults to `"Novo"` / `"Editar"`, but can be overridden with the `title` prop.

---

### Props

| Prop               | Type                          | Description                                                                 |
| ------------------ | ----------------------------- | --------------------------------------------------------------------------- |
| `id`               | `string`                      | Optional record ID. Automatically set when `openModal({ id })` is called.   |
| `title`            | `string`                      | Modal title. Defaults to `"Novo"` or `"Editar"`.                            |
| `endpoint`         | `string`                      | API endpoint (e.g. `"profiling/question"`).                                 |
| `fields`           | `any[]`                       | Array of field definitions (labels, types, options, etc.).                  |
| `schema`           | `z.ZodSchema<any>`            | Validation schema for the form.                                             |
| `parseFetchedData` | `(data: any) => Promise<any>` | Optional transformer for fetched data before populating the form.           |
| `mutationParams`   | `Record<string, any>`         | Extra params included in the mutation payload.                              |
| `buttonLabel`      | `string \| boolean`           | Submit button label. If `false`, the button is hidden. Defaults to `false`. |
| `onSuccess`        | `(response: any) => void`     | Callback executed after a successful submit.                                |
| `cols`             | `number`                      | Number of columns in the form layout.                                       |

---

### Features

* **Automatic mode detection** (`create` vs `edit`)
* **Zod validation** applied client-side before mutation
* **API integration** with automatic create/update calls
* **React Query support** — queries invalidated after mutation
* **Composable forms** — define fields once, reuse anywhere
* **Programmatic control** via hook (`useModalForm`)

---

### Usage Examples

#### Basic Create Modal

```tsx
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

#### Edit Mode via Hook

```tsx
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