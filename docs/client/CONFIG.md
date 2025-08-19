# Client Configuration (`CONFIG.md`)

The **client configuration** allows Struct to render your UI consistently while remaining **UI-agnostic**. This is done by providing a config object to the `StructUIProvider` at the root of your application.

---

## 🛠 Setup

Wrap your application with `StructUIProvider` in your root layout or top-level component:

```tsx
import { StructUIProvider } from "@discovery-solutions/struct/client";
import { Toaster } from "sonner";
import { components } from "./components"; // your component mapping

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StructUIProvider config={components}>
      <Toaster />
      {children}
    </StructUIProvider>
  );
};
```

> ⚡ **Important:** You do **not** need to wrap the app with `QueryClientProvider`. Struct already provides a QueryClient internally.

---

## ⚙️ Components Configuration

The `config` object maps **Struct field types and core components** to your UI library. Example:

```ts
import { Dialog, DialogTrigger, DialogDescription, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const components = {
  // If you want custom inputs to use in your forms, you can just add them here:
  // Textarea,
  // Select,
  // Toggle,
  // Checkbox,
  // FileUpload,
  // AvatarUpload,
  // ImageUpload,
  // InputTags,

  // Core
  Button,
  Input,
  Loader,
  DataTable,

  // Card
  Card: {
    Header: CardHeader,
    Content: CardContent,
    Title: CardTitle,
    Description: CardDescription,
  },

  // Dialog
  Dialog: {
    Root: Dialog,
    Trigger: DialogTrigger,
    Content: DialogContent,
    Header: DialogHeader,
    Title: DialogTitle,
    Description: DialogDescription,
    Footer: DialogFooter,
  },

  // Dropdown
  Dropdown: {
    Root: DropdownMenu,
    Trigger: DropdownMenuTrigger,
    Content: DropdownMenuContent,
    Item: DropdownMenuItem,
  },

  // Toast system
  toast,

  // Aliases → maps field type → component
  alias: {
    text: "Input",
    textarea: "Textarea",
    select: "Select",
    checkbox: "Checkbox",
    toggle: "Toggle",
    file: "FileUpload",
    avatar: "AvatarUpload",
    image: "ImageUpload",
    tags: "InputTags",
  },
};
```

---

## 🧩 Required Components

Struct expects the following components from your UI layer:

| Component   | Notes                                                                      |
| ----------- | -------------------------------------------------------------------------- |
| `Input`     | Basic text input                                                           |
| `Button`    | Clickable button                                                           |
| `Loader`    | Loading spinner                                                            |
| `DataTable` | Table for displaying lists                                                 |
| `Card`      | Must provide `Header`, `Content`, `Title`, `Description`                   |
| `Dialog`    | Must provide `Root`, `Trigger`, `Content`, `Header`, `Title`, `Description`, `Footer` |
| `Dropdown`  | Must provide `Root`, `Trigger`, `Content`, `Item`                          |
| `toast`     | Should support `.success()`, `.error()`, etc.                              |

> Optional: form inputs like `Textarea`, `Select`, `Toggle`, `Checkbox`, `FileUpload`, `AvatarUpload`, `ImageUpload`, `InputTags`.

---

## 🔧 Notes

* The client config **does not include database or auth logic**. These are handled in the backend (`struct.ts`).
* All client-side CRUDs, forms, and data components rely on this configuration.
* By using the aliases, Struct can automatically render fields in generic forms without explicit mapping.