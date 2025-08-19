# ⚙️ Configuration Guide (`Struct.configure`)

The **Struct library** requires minimal setup in your Next.js project.
Configuration is done **once**, and then the rest of your app can import the configured `Struct` instance.

---

## 1. `StructConfig` Type

The `Struct.configure()` method accepts a single `StructConfig` object:

```ts
export type StructConfig = {
  database?: {
    startConnection: (...args: any) => Promise<any>
  }
  auth?: {
    getSession?: () => Promise<any>
    getUser?: () => Promise<any>
  }
}
```

### Available Options

* **`database.startConnection`** → Async function to establish your DB connection (e.g., Mongoose).
* **`auth.getSession`** → (Optional) Function to retrieve the current session.
* **`auth.getUser`** → (Optional) Function to resolve the current user.

---

## 2. Create a `struct.ts` Bootstrap File

At the root of your project (`/src` or `/`), create a **`struct.ts`** file:

```ts
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

This ensures **everywhere else in your app imports from this file** instead of the raw package:

```ts
// ✅ Good
import { Struct } from "@/struct";

// ❌ Avoid
import { Struct } from "@discovery-solutions/struct";
```

---

## 3. Configure Next.js (`next.config.js`)

Update your `next.config.js` to transpile the package and register path aliases:

```ts
import { type NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@discovery-solutions/struct" // Required for Tailwind + bundling
  ],
  webpack(config) {
    // Optional: extra Webpack aliases (not used by Turbopack)
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
};

export default nextConfig;
```

> ⚠️ **Note:** Tailwind CSS import in globals is no longer required.

---

## 4. Extending `StructUser`

You can extend the default `StructUser` type to include custom roles or permissions:

```ts
// types/struct.d.ts
import type { StructUser as BaseUser } from "@discovery-solutions/struct";

declare module "@discovery-solutions/struct" {
  export interface StructUser extends BaseUser {
    role: "admin" | "user" | "superadmin";
    permissions?: string[];
  }
}
```

This allows TypeScript to recognize additional fields across your app.

---

## ✅ Summary

After setup:

* **struct.ts** → single entrypoint for config + re-exports.
* **Next.js config** → ensures transpilation + aliases work.
* **StructUser extension** → adds custom roles/permissions.
* Your app can now safely import anywhere:

```ts
import { CRUDController, Struct } from "@/struct";
```