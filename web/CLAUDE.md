# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Stack

Next.js 16 (App Router) + React 19 frontend for "good-taste". The API backend is a separate Express/Prisma service (sibling `api/` directory) running at `http://localhost:8000`.

| Layer | Technology |
|---|---|
| Framework | Next.js 16, App Router, React 19, React Compiler enabled |
| UI Components | shadcn/ui (`radix-luma` style), local copies in `src/components/ui` |
| Auth | better-auth client (`@/lib/auth-client`) |
| Forms | react-hook-form — always use `Controller`, never `register` |
| Validation | Zod schemas in `@/schemas` |
| Toast | sonner |
| Styling | Tailwind CSS v4 |
| File uploads | uploadthing |

## Commands

```bash
pnpm dev          # Next.js dev server with Turbopack (port 3000)
pnpm build        # Production build
pnpm start        # Start production build
pnpm lint         # ESLint
pnpm format       # Prettier write (ts/tsx)
pnpm typecheck    # tsc --noEmit
```

There is no test runner configured in this app.

## Architecture

```
src/
  app/              # App Router pages & layouts (route groups under dashboard/)
  app/dashboard/    # Authenticated admin area — nested routes per resource
                     # (products, products/[slug], products/categories, products/variants,
                     #  users, users/[id], sales, settings, settings/loyalty-tiers, settings/wallet-config)
  components/       # App-level shared components (sidebar, header, nav, tables, dialogs)
  components/ui/    # shadcn primitives — always import from here, never re-add via shadcn CLI
  actions/          # Server Actions ('use server') — apiFetch.ts, queries.ts, mutations.ts
  lib/              # auth-client, routes, nav-config, utils (cn), error, uploadthing
  schemas/          # Zod schemas, all re-exported from src/schemas/index.ts
  hooks/            # Custom React hooks (e.g. useUrlParams, use-mobile)
  types/            # Shared TypeScript types
  proxy.ts          # Next 16's middleware equivalent — auth route guard
```

`@/*` resolves to `./src/*` (see tsconfig.json). Despite older docs referencing `packages/schemas` or `packages/ui`, this app is **not** a turborepo package consumer for those — schemas live in `src/schemas/`, UI primitives live in `src/components/ui/`.

## API access pattern

All backend calls go through `src/actions/apiFetch.ts`:

- `getSessionToken()` reads the `__Secure-goodtaste.session_token` cookie. Must be called **outside** any `'use cache'` boundary.
- `apiFetch<T>(endpoint, sessionToken, options)` — calls `${API_URL}${endpoint}`, attaches the session cookie, throws `ApiError` (from `@/lib/error`) on non-OK responses.
- `safeApiFetch<T>(...)` — same, but returns `ActionResult<T>` (`{ success, data }` or `{ success: false, message, status }`) instead of throwing. Prefer this in Server Actions / Server Components that need to handle errors gracefully.
- `API_URL` env var (`.env`) points at the API's versioned base, e.g. `http://localhost:8000/api/v1`.
- Server Actions live in `src/actions/queries.ts` (reads) and `src/actions/mutations.ts` (writes), both marked `'use server'`.

## Authentication

`authClient` singleton is in `src/lib/auth-client.ts`, built with `better-auth/react` + `adminClient` + `inferAdditionalFields` (extra user fields: `role`, `banned`, `banReason`, `banExpires`).

```ts
import { authClient } from "@/lib/auth-client"

const { data, error } = await authClient.signIn.email({ email, password, callbackURL: "/dashboard" })
const { data: session } = authClient.useSession()
await authClient.admin.banUser({ userId })
await authClient.admin.setRole({ userId, role: "admin" })
```

Never call the API's auth endpoints (`/api/v1/auth/*`) directly — always go through `authClient`.

`src/proxy.ts` is the route guard (Next 16 renamed `middleware.ts` to `proxy.ts`): it checks for the `goodtaste`-prefixed session cookie via `getSessionCookie`, redirects unauthenticated users to `/login` for protected routes, and redirects authenticated users away from `/login`/`/register`. Public/auth route lists live in `src/lib/routes.ts`. The matcher explicitly excludes `/api/uploadthing` because UploadThing's CDN makes server-to-server webhook calls without user cookies.

## Forms — react-hook-form with Controller

**Always use `Controller`**, never `register()`. Pair with `zodResolver` and schemas from `@/schemas`.

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

<form onSubmit={handleSubmit(onSubmit)}>
    <Controller
        name="fieldName"
        control={control}
        render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Label</FieldLabel>
                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} disabled={isSubmitting} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
        )}
    />
</form>
```

Reference implementation: `src/app/login/_components/login-form.tsx`.

## Zod Schemas

All schemas live in `src/schemas/` and are re-exported from `src/schemas/index.ts` (one file per domain: `auth`, `user`, `stock`, `order`, `inquiry`, `settings`). Always import from `@/schemas` — don't define ad-hoc schemas inline if a shared one already exists. When adding a new schema, create the file in `src/schemas/` and add an `export * from "./<name>"` to `index.ts`.

## UI conventions

- Import shadcn primitives from `@/components/ui/<component>` (Button, Input, Card, Field/FieldLabel/FieldError/FieldGroup/FieldDescription, etc.). Never run the shadcn CLI to re-add a primitive into this app.
- Use `cn()` from `@/lib/utils` for conditional class merging — it's the most cross-referenced utility in the codebase.
- Toasts via `sonner`: `toast.success(...)`, `toast.error(...)`. Always toast on auth/action errors, e.g. `if (error) toast.error(error.message)`.
- Client components must declare `'use client'` at the top; Server Actions in `src/actions/` must declare `'use server'`.
- `tsconfig.json` sets `declaration: false` — this app never emits `.d.ts` files.
- `next.config.mjs` enables `cacheComponents` and `reactCompiler`; remote image hosts are allowlisted there (picsum, UploadThing CDN, local `/uploads`).
