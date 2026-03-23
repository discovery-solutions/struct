# fetcher

The `fetcher` is the **internal HTTP client** used by Struct for all client-side API calls. It wraps the native `fetch` API with convenience defaults for JSON APIs.

---

## Usage

```ts
import { fetcher } from "@discovery-solutions/struct";

const data = await fetcher("/api/users");

const created = await fetcher("/api/users", {
  method: "POST",
  body: { name: "Lucas", email: "lucas@example.com" },
});
```

---

## Options

| Option    | Type                                          | Default  | Description                                              |
| --------- | --------------------------------------------- | -------- | -------------------------------------------------------- |
| `method`  | `"GET" \| "POST" \| "PUT" \| "PATCH" \| "DELETE"` | `"GET"`  | HTTP method.                                             |
| `body`    | `any`                                         | —        | Request body. See note below.                            |
| `params`  | `Record<string, any>`                         | —        | Query string parameters, appended as `?key=value`.       |
| `headers` | `Record<string, string>`                      | `{}`     | Additional request headers.                              |
| `baseUrl` | `string`                                      | `""`     | Base URL prepended to every request.                     |

---

## Important: `body` does not need `JSON.stringify`

> **Never pass `JSON.stringify(data)` as the body.** The `fetcher` handles serialization internally.

The `fetcher` automatically:
- Calls `JSON.stringify(body)` before sending, when `body` is a plain object.
- Sets `Content-Type: application/json` automatically for non-`FormData` bodies.
- Passes `FormData` bodies through as-is (no stringify, no Content-Type override).

```ts
// ✅ Correct
fetcher("/api/users", { method: "POST", body: { name: "Lucas" } });

// ❌ Wrong — double-serializes the body
fetcher("/api/users", { method: "POST", body: JSON.stringify({ name: "Lucas" }) });
```

---

## Error Handling

If the response is not `ok`, `fetcher` throws an `Error` with the message extracted from:
1. `data.message`
2. `data.error`
3. Fallback: `"Request failed with status {status}"`

---

## Response

Returns the parsed JSON body for `application/json` responses, or raw text otherwise.
