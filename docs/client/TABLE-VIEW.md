# TableView

The **`TableView`** component is a **flexible, client-side data table** for listing items fetched from a backend API. It integrates seamlessly with **StructUIProvider**, **React Query**, and your defined UI components. It’s ideal for **CRUD interfaces**, dashboards, or any list-view that needs searching, pagination, and inline actions like edit or delete.

---

## ⚙️ Key Concepts

### Data Fetching

* `TableView` fetches its data via a **GET request** to the specified `endpoint` using the internal `fetcher` utility.
* Supports `queryParams` for filtering, sorting, or passing extra API options.
* Uses **React Query** under the hood:

  * Automatically caches results.
  * Does **not refetch on window focus** or reconnect by default.
  * Exposes loading states for UI feedback.

### Columns & Actions

* `columns`: an array of objects defining table headers and cell renderers.
* By default, `TableView` appends an `"Ações"` column with edit and delete actions.
* The edit action can:

  * Open a **modal form** if `asChild` is `true`.
  * Navigate to a separate edit page otherwise.
* Delete action shows a **confirmation dialog**, integrates with the API via `DELETE`, and automatically invalidates React Query caches.

---

### Props

| Prop                  | Type                  | Description                                                                              |
| --------------------- | --------------------- | ---------------------------------------------------------------------------------------- |
| `columns`             | `any[]`               | Columns definition for the table. Each column can define a `header` and `cell` renderer. |
| `endpoint`            | `string`              | API path for fetching table data, e.g., `"users"`.                                       |
| `hideAdd`             | `boolean`             | If `true`, hides the "Add new" button in the `SearchHeader`.                             |
| `asChild`             | `boolean`             | If `true`, edit actions open modals instead of redirecting.                              |
| `queryParams`         | `Record<string, any>` | Optional query parameters sent with the fetch request.                                   |
| `LeftItems`           | `ReactNode`           | Custom content rendered in the left side of the `SearchHeader`.                          |
| `ListHeaderComponent` | `ReactNode`           | Optional component replacing the default `SearchHeader`.                                 |
| `ListEmptyComponent`  | `ReactNode`           | Component to render when the table is empty. Defaults to a text message.                 |
| `ListFooterComponent` | `ReactNode`           | Optional footer component rendered below the table.                                      |

---

### Features

1. **Searchable**: Typing in the `SearchHeader` filters rows client-side by matching any serialized field content.
2. **Dynamic Actions**: Edit and delete actions are fully customizable. Edit can open modals or navigate, and delete shows a confirmation dialog integrated with API calls.
3. **Loading States**: Shows a loader from your `StructUIProvider` while data is loading.
4. **Empty State**: Displays a default message if no items are found, or a custom component if provided.
5. **Reactivity**: Any changes (delete, edit, etc.) automatically update the table by invalidating the React Query cache.
6. **UI-Agnostic**: Uses `Struct.DataTable`, `Struct.Dialog`, `Struct.Button`, and `Struct.Dropdown` components from your UI provider. You can swap them for your own implementation.
7. **Flexible Layout**: Works in standard list pages or as a child component in more complex layouts (`asChild`).

---

### Usage Example

```tsx
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

* `columns` could be defined as:

```ts
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

### Notes on Integration

* **Dropdown Actions**: The `"Ações"` column uses `Struct.Dropdown` and `Struct.Button` for edit/delete menus.
* **Dialogs**: Deletion confirmation leverages `Struct.Dialog` components and is fully customizable.
* **React Query Cache**: After delete or edit actions, `queryClient.invalidateQueries` ensures the table stays in sync with the server.
* **Custom Components**: `ListHeaderComponent`, `ListEmptyComponent`, and `ListFooterComponent` can completely replace or extend the default behavior.
* **Client-Side Filtering**: `search` filters all rows in a case-insensitive manner. For large datasets, consider server-side filtering via `queryParams`.