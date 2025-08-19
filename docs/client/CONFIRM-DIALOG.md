# ConfirmDialog

The **`ConfirmDialog`** is a **flexible, reusable confirmation modal** that integrates seamlessly with **StructUIProvider** and **React Query**. It supports:

* Built-in API calls (`DELETE`, `PATCH`, `POST`) via `fetcher`.
* Custom triggers (hook or child)
* External control through the `useConfirmDialog` hook.
* Toast notifications and query invalidation automatically.

---

## ⚙️ Key Concepts

### Controlled vs Internal State

* `ConfirmDialog` can be **controlled externally** via `open` and `onOpenChange` props.
* If no `open` is provided, it uses **internal state** automatically.
* This allows both inline and programmatic control of the modal.

### Trigger via `children`

* You can pass a **custom trigger element** as a child element.
* Clicking this element will automatically open the dialog.

```tsx
<ConfirmDialog
  endpoint="users"
  params={{ id: "123" }}
>
  <button className="btn-destructive">Delete User</button>
</ConfirmDialog>
```

### Trigger via Hook

* Use the exported `useConfirmDialog` hook to control the dialog programmatically.

```ts
const { open, setOpen, trigger } = useConfirmDialog();
<ConfirmDialog open={open} onOpenChange={setOpen} endpoint="users" params={{ id: "123" }} />
<button onClick={trigger}>Delete User</button>
```

---

### Props

| Prop           | Type                      | Description                                                      |           |                                                       |                                                                     |
| -------------- | ------------------------- | ---------------------------------------------------------------- | --------- | ----------------------------------------------------- | ------------------------------------------------------------------- |
| `open`         | `boolean`                 | Optional controlled open state.                                  |           |                                                       |                                                                     |
| `onOpenChange` | `(open: boolean) => void` | Optional callback when modal open state changes.                 |           |                                                       |                                                                     |
| `title`        | `string`                  | Dialog title. Defaults to `"Tem certeza que deseja continuar?"`. |           |                                                       |                                                                     |
| `description`  | `string`                  | Dialog description. Defaults to `"Essa ação é irreversível."`.   |           |                                                       |                                                                     |
| `endpoint`     | `string`                  | Optional API endpoint for the action.                            |           |                                                       |                                                                     |
| `params`       | `{ id: string }`          | Optional parameters for the API call (usually `{ id }`).         |           |                                                       |                                                                     |
| `method`       | \`"DELETE"                | "PATCH"                                                          | "POST"\`  | HTTP method for the API call. Defaults to `"DELETE"`. |                                                                     |
| `onSuccess`    | `() => void`              | Callback executed after a successful API response.               |           |                                                       |                                                                     |
| `onPress`      | `() => void`              | Optional custom action handler instead of default mutation.      |           |                                                       |                                                                     |
| `onError`      | `(error: any) => void`    | Callback executed if the API call fails.                         |           |                                                       |                                                                     |
| `variant`      | \`"default"               | "destructive"                                                    | "outline" | ...\`                                                 | Button variant for the confirm button. Defaults to `"destructive"`. |
| `children`      | `ReactNode`               | Optional trigger element that opens the dialog when clicked.     |           |                                                       |                                                                     |

---

### Features

* **API integration:** automatically executes the defined HTTP method to the specified endpoint.
* **Toast notifications:** shows success/error messages automatically via `Struct.toast`.
* **React Query integration:** invalidates all queries on success to keep data in sync.
* **Custom triggers:** supports inline triggers as child or external control via hook.
* **Loader support:** displays `Struct.Loader` while mutation is pending.
* **Flexible usage:** can be controlled or uncontrolled, fully customizable.

---

### Usage Examples

#### Inline Trigger

```tsx
<ConfirmDialog
  endpoint="users"
  params={{ id: "123" }}
>
  <button className="btn-destructive">Delete User</button>
</ConfirmDialog>
```

#### Hook-Controlled

```tsx
const { open, setOpen, trigger } = useConfirmDialog();

<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  endpoint="users"
  params={{ id: "123" }}
/>

<button onClick={trigger}>Delete User</button>
```

#### Custom onPress

```tsx
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  onPress={() => console.log("Custom action executed!")}
>
  <button className="btn">Do Something</button>
</ConfirmDialog>
```