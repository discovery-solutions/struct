# `ModelService<T>`

The **`ModelService`** is a lightweight abstraction over Mongoose models, providing generic CRUD operations with typed support.
It is designed to work standalone or as the backend layer for [`CRUDController`](./crud-controller.md).

---

## Purpose

Mongoose is powerful but often verbose and repetitive when writing controllers.
`ModelService` helps by:

* Wrapping common queries in reusable, typed methods.
* Normalizing results with `parseEntityToObject`.
* Providing consistency across models.
* Acting as the foundation for `CRUDController`.

---

## Usage

```ts
import { User, UserInterface } from "@/models/user";
import { ModelService } from "@/struct";

const userService = new ModelService<UserInterface>(User);

// Fetch user
const user = await userService.findOne({ email: "john@example.com" });
```

---

## API Reference

### `constructor(model: Model<T>)`

Initializes the service with a Mongoose model.

* `model`: a valid Mongoose model.

---

### `findOne(query: FilterQuery<T>, ...args: any): Promise<T | null>`

Finds a single document by a MongoDB query.
Returns a plain object or `null`.

```ts
const user = await userService.findOne({ email: "john@example.com" });
```

---

### `findById(id: string | T, populate?: string[]): Promise<T | null>`

Finds a document by ID. Supports `populate`.

```ts
const user = await userService.findById("507f191e810c19729de860ea", ["roles"]);
```

---

### `findMany(query?: FilterQuery<T>): Promise<T[]>`

Finds multiple documents by query. Returns a plain array.

```ts
const users = await userService.findMany({ active: true });
```

---

### `create(data: Partial<T>): Promise<T>`

Creates and saves a new document.

```ts
const newUser = await userService.create({ name: "John", email: "john@example.com" });
```

---

### `updateOne(query: FilterQuery<T>, updates: UpdateQuery<T>): Promise<T | null>`

Updates the first document matching a query. Returns the updated object.

```ts
const updatedUser = await userService.updateOne({ email: "john@example.com" }, { name: "Johnny" });
```

---

### `updateById(id: string, updates: UpdateQuery<T>): Promise<T | null>`

Updates a document by its `_id`.

```ts
const updatedUser = await userService.updateById("507f191e810c19729de860ea", { active: false });
```

---

### `deleteOne(query: FilterQuery<T>): Promise<void>`

Deletes a single document matching the query.

```ts
await userService.deleteOne({ email: "john@example.com" });
```

---

## Notes

* All queries automatically return **lean objects** instead of hydrated Mongoose documents, ensuring better performance and serialization safety.
* Use `parseEntityToObject` (already integrated) to sanitize or transform raw Mongoose data.
* Best used in combination with [`CRUDController`](./crud-controller.md) for route-level APIs.