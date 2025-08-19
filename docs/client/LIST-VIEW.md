# ListView (`client/CONFIG.md`)

The **`ListView`** component is a **flexible, generic list/grid renderer** that works with either **local data** or **data fetched from a backend API**. It is fully integrated with **StructUIProvider** and **React Query**, and allows you to render custom item cards, headers, footers, and separators.

It is ideal for:

* Rendering card-based or flexible layouts.
* Custom dashboards or feeds.
* Client-side search/filtering.
* Flexible rendering without enforcing a table structure.

---

## ⚙️ Key Concepts

### Data Handling

* **Supports `data` prop**: pass an array directly.
* **Supports `endpoint` prop**: fetches data automatically using the internal `fetcher` utility.
* Uses **React Query** for caching, loading state, error handling, and refetching.
* **Client-side filtering**: supports `filters.search` and internal `search` state to filter items by JSON string match.
* Automatically handles empty states and error states.

### Custom Rendering

* `renderItem(item, index)`: function to render each individual item.
* `keyExtractor(item, index)`: optional function to generate unique keys.
* Supports **item separators** between elements (`ItemSeparatorComponent`).

---

## Props

| Prop                       | Type                                    | Description                                                  |                                            |
| -------------------------- | --------------------------------------- | ------------------------------------------------------------ | ------------------------------------------ |
| `data`                     | `T[]`                                   | Optional static array of items. Overrides fetched data.      |                                            |
| `endpoint`                 | `string`                                | Optional API path for fetching data, e.g., `"products"`.     |                                            |
| `queryParams`              | `any`                                   | Optional query parameters for fetching.                      |                                            |
| `filters`                  | `{ search?: string }`                   | Optional filter object, supports client-side search.         |                                            |
| `asChild`                  | `boolean`                               | Passes through to `SearchHeader` or other child components.  |                                            |
| `className`                | `string`                                | Optional CSS classes for the main container.                 |                                            |
| `containerClassName`       | `string`                                | Optional CSS classes for the items container.                |                                            |
| `renderItem`               | `(item: T, index: number) => ReactNode` | Required. Renders each item.                                 |                                            |
| `keyExtractor`             | \`(item: T, index: number) => string    | number\`                                                     | Optional. Generates unique keys for items. |
| `ListHeaderComponent`      | `ReactNode`                             | Optional component replacing default `SearchHeader`.         |                                            |
| `LeftSideHeaderComponent`  | `ReactNode`                             | Custom left side component in header.                        |                                            |
| `RightSideHeaderComponent` | `ReactNode`                             | Custom right side component in header.                       |                                            |
| `ListEmptyComponent`       | `ReactNode`                             | Rendered when there are no items.                            |                                            |
| `ListFooterComponent`      | `ReactNode`                             | Rendered below the list.                                     |                                            |
| `ItemSeparatorComponent`   | `ReactNode`                             | Rendered between items.                                      |                                            |
| `refetchOnMount`           | `boolean`                               | Whether to refetch data on mount. Defaults to `true`.        |                                            |
| `hideContent`              | `boolean`                               | Optionally hide content while still rendering header/footer. |                                            |

---

## Features

1. **Flexible Layouts**: Render rows, grids, or cards.
2. **Client-Side Filtering**: Search items by any property (JSON string matching).
3. **Integrated Loading/Error States**: Uses `Struct.Loader` and buttons for retries.
4. **Empty State**: Default message or fully customizable component.
5. **Header/Footer**: Easily replace default header with `ListHeaderComponent`, add `ListFooterComponent`.
6. **Custom Separators**: `ItemSeparatorComponent` renders between items.
7. **Composable**: Can be used standalone or nested inside other layouts.

---

## Usage Example

```tsx
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

* Supports **dynamic fetching** from API or static `data` arrays.
* Can **filter via search**: typing in the header input filters visible items.
* Fully **UI-agnostic** via `StructUIProvider`.