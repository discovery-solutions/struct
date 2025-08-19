* Setup example

```ts
// struct.config.ts
import { Struct } from "@discovery-solutions/struct";

Struct.configure({
  database: {
    startConnection: async () => {
      await mongoose.connect(process.env.MONGO_URI!)
    }
  },
  auth: {
    getSession: () => {/* ... */},
    getUser: () => {/* ... */}
  }
})
```

* Extending `StructurUser`:

```
// types/struct.d.ts
import type { StructUser as BaseUser } from "@discovery-solutions/struct";

declare module "@discovery-solutions/struct" {
  export interface StructUser extends BaseUser {
    role: "admin" | "user" | "candidate";
    permissions?: string[];
  }
}
```