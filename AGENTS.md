# Good Taste — Monorepo Agent Instructions

Full-stack food/restaurant platform. Turborepo monorepo with pnpm workspaces.

## Apps

| App | Path | Stack | Agent Instructions |
|---|---|---|---|
| `api` | `apps/api/` | Express, Prisma, PostgreSQL | [apps/api/AGENTS.md](apps/api/AGENTS.md) |
| `web` | `apps/web/` | Next.js 16, React 19 | [apps/web/AGENTS.md](apps/web/AGENTS.md) |

## Shared Packages

| Package | Import alias | Purpose |
|---|---|---|
| `packages/schemas` | `@/schemas` | Shared Zod schemas + inferred types (used by both apps) |
| `packages/ui` | `@workspace/ui` | shadcn/ui component library |
| `packages/typescript-config` | `@workspace/typescript-config` | Shared tsconfig bases |
| `packages/eslint-config` | `@workspace/eslint-config` | Shared ESLint configs |

## Root Commands

```bash
pnpm dev          # Run all apps in parallel
pnpm build        # Build all apps/packages
pnpm lint         # Lint all packages
pnpm typecheck    # Type check all packages
pnpm format       # Format with Prettier
```

Scope to one app: `pnpm --filter web <script>` or `pnpm --filter api <script>`.

## Key Conventions

- **Auth split**: better-auth runs on the API (`apps/api/src/lib/auth.ts`). The web uses `authClient` from `@/lib/auth-client` — never call `/api/v1/auth/*` directly from web code.
- **Schemas first**: Before adding a Zod schema inline anywhere, check `packages/schemas/src/`. Add shared schemas there and re-export from `packages/schemas/src/index.ts`.
- **UI source of truth**: All shadcn/ui components live in `packages/ui`. Do not run `shadcn add` inside `apps/web` — add to `packages/ui` instead.
- **Forms**: web app uses `Controller` from react-hook-form exclusively — never `register()`.
- **Package manager**: pnpm only. Node >= 20 required.
