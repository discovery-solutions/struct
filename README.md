# @discovery-solutions/struct

A structured framework for building **forms, CRUDs, and admin interfaces** with **Next.js, React Hook Form, Zod, TanStack Query, and TailwindCSS**.
The goal is to provide a consistent way to define UI elements and data workflows while keeping the UI layer customizable through an injected `StructUIProvider`.

---

## 🚀 Key Features

* **UI Agnostic** → works with ShadCN, Radix, or any custom design system.
* **Structured CRUDs** → generate list, detail, and edit views with minimal boilerplate.
* **Forms with Validation** → powered by `react-hook-form` + `zod`.
* **Async Data Management** → built on top of `@tanstack/react-query`.
* **Composable** → all building blocks are exposed, no hidden magic.

---

## 📦 Installation

```bash
npm install @discovery-solutions/struct
# or
yarn add @discovery-solutions/struct
# or
pnpm add @discovery-solutions/struct
```

---

## 📁 Documentation Overview

The package ships with detailed documentation for both **API/backend** and **client-side** components.

### API / Backend Docs

* `CONFIG.md` → configuration guide for database and auth setup.
* `CRUD.md` → backend CRUD controller for Mongoose models.
* `MODEL-SERVICE.md` → low-level model service for database operations.

### Client / Frontend Docs

* `CONFIG.md` → client configuration guide (StructUIProvider, StructUser extension).
* `CONFIRM-DIALOG.md` → reusable confirmation dialog component.
* `FORM.md` → generic dynamic form component with validation.
* `LIST-VIEW.md` → flexible list view component with search, filters, and custom items.
* `MODAL-FORM.md` → modal wrapper for forms integrated with API and validation.
* `TABLE-VIEW.md` → data table component with inline actions, search, and React Query integration.

### Project Structure

```
DSCVR.STRUCT/
├─ project/
│  ├─ dist/
│  └─ docs/
│     ├─ api/
│     │  ├─ CONFIG.md
│     │  ├─ CRUD.md
│     │  └─ MODEL-SERVICE.md
│     └─ client/
│        ├─ CONFIG.md
│        ├─ CONFIRM-DIALOG.md
│        ├─ FORM.md
│        ├─ LIST-VIEW.md
│        ├─ MODAL-FORM.md
│        └─ TABLE-VIEW.md
└─ README.md
```

---

## 📖 Next Steps

After installing:

1. Follow the [API Configuration Guide](./docs/api/CONFIG.md) to setup your database and auth integration.
2. Implement your models and CRUD endpoints with [CRUD.md](./docs/api/CRUD.md) and [MODEL-SERVICE.md](./docs/api/MODEL-SERVICE.md).
3. Customize the UI via your [StructUIProvider](./docs/client/CONFIG.md) instance.
4. Build your client interfaces using [LIST-VIEW](./docs/client/LIST-VIEW.md), [TABLE-VIEW](./docs/client/TABLE-VIEW.md), [FORM](./docs/client/FORM.md), and [MODAL-FORM](./docs/client/MODAL-FORM.md) components.
5. Use [CONFIRM-DIALOG](./docs/client/CONFIRM-DIALOG.md) for safe destructive actions.