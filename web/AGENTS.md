# Web – Agent Instructions

This is the **Next.js 16 (App Router)** frontend inside the `good-taste` Turborepo.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16, App Router, React 19 |
| UI Components | shadcn/ui via `packages/ui` (`@workspace/ui`) |
| Auth | better-auth client (`@/lib/auth-client`) |
| Forms | react-hook-form — always use `Controller`, never `register` |
| Validation | Zod via `@/schemas` |
| Toast | sonner |
| Styling | Tailwind CSS v4 |
| Package manager | pnpm workspace |

## Key Commands

```bash
pnpm dev          # Next.js dev server with Turbopack (port 3000)
pnpm build        # Production build
pnpm typecheck    # Type check only (tsc --noEmit)
pnpm lint         # Lint
```

> From repo root: `pnpm --filter web <script>`

## Project Structure

```
src/
  app/              # App Router pages & layouts
  components/       # App-level shared components (sidebar, nav, header)
  lib/
    auth-client.ts  # better-auth client singleton — always import from here
    nav.tsx         # Navigation config
  actions/          # Next.js Server Actions
  hooks/            # Custom React hooks
  types/            # TypeScript types
```

## UI Components

Always import from `@/components/ui/<component>`. Never install shadcn primitives directly into this app.

```ts
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel, FieldError, FieldGroup, FieldDescription } from "@/components/ui/field"
```

Use `cn()` from `@/lib/utils` for conditional class merging.

## Forms — react-hook-form with Controller

**Always use `Controller`** — never `register()`. Always pair with `zodResolver`.

```tsx
'use client';

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MySchema, mySchema } from "@/schemas";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const { handleSubmit, control, formState: { isSubmitting } } = useForm<MySchema>({
    resolver: zodResolver(mySchema),
    defaultValues: { fieldName: "" },
});

// JSX pattern:
<form onSubmit={handleSubmit(onSubmit)}>
    <Controller
        name="fieldName"
        control={control}
        render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Label</FieldLabel>
                <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
        )}
    />
</form>
```

Reference: [login form](src/app/login/_components/login-form.tsx)

## Zod Schemas

All schemas live in `packages/schemas/src/` and export from `@/schemas`. Always import from there — never define ad-hoc schemas inline if a shared one exists.

```ts
import { signInSchema, SignIn } from "@/schemas";
// Also available: signUpSchema, SignUp, and others from stock/user modules
```

When creating a new schema, add it to `packages/schemas/src/` and re-export from `packages/schemas/src/index.ts`.

## Authentication

The `authClient` singleton is in [src/lib/auth-client.ts](src/lib/auth-client.ts). It uses `adminClient` and `inferAdditionalFields` plugins. The user model has extra fields: `role`, `banned`, `banReason`, `banExpires`.

```ts
import { authClient } from "@/lib/auth-client";

// Sign in (redirects via callbackURL)
const { data, error } = await authClient.signIn.email({
    email, password, callbackURL: "/dashboard"
});

// Get session in a client component
const { data: session } = authClient.useSession();

// Admin operations
await authClient.admin.banUser({ userId });
await authClient.admin.setRole({ userId, role: "admin" });
```

The API backend handles auth at `http://localhost:8000/api/v1/auth/*`. **Never call auth endpoints directly** — always use `authClient`.

## Toast Notifications

```ts
import { toast } from "sonner";
toast.success("Saved");
toast.error("Failed: " + error.message);
```

Always show a toast on auth errors: `if (error) { toast.error(error.message) }`.

## TypeScript Notes

- `declaration: false` is set in `tsconfig.json` (overrides base) — the web app never emits `.d.ts` files
- Client components must have `'use client'` at the top
- Server Actions go in `src/actions/` and must be marked `'use server'`
