# API – Agent Instructions

This is the **Express + Prisma REST API** inside the `good-taste` Turborepo. It serves both the `apps/web` (Next.js) and a mobile app.

## Project Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express 4 |
| ORM | Prisma 7 (driver adapter: `@prisma/adapter-pg`) |
| Database | PostgreSQL |
| Validation | Zod |
| Auth | better-auth (Express adapter) |
| Image storage | Cloudflare Images |
| Build | tsdown → CJS output (`dist/*.cjs`) |
| Package manager | pnpm (workspace) |

## Monorepo Context

- Root: `d:/githup-reps/works/good-taste/`
- Shared packages: `packages/ui`, `packages/eslint-config`, `packages/typescript-config`
- This package name: `api` — import shared config via `@workspace/` prefix

## Key Commands

```bash
# Development (hot reload via tsx watch)
pnpm dev

# Production build (tsdown → dist/*.cjs)
pnpm build

# Start built output
pnpm start

# Type check only (no emit)
pnpm check-types

# Lint (zero warnings policy)
pnpm lint

# Tests
pnpm test
```

> From repo root, scope to this package: `pnpm --filter api <script>`

## Project Structure

```
src/
  index.ts        # Minimal entry (legacy, prefer server.ts)
  server.ts       # Express app setup: helmet, cors, rate-limit, compression
  lib/
    prisma.ts     # Prisma singleton using PrismaPg driver adapter
    common.ts     # CustomError class (statusCode, isOperational)
prisma/
  schema.prisma   # Prisma schema — output goes to generated/prisma/
generated/
  prisma/         # Generated Prisma client — never edit manually
```

## Architecture Conventions

### Routing
- All API routes are versioned under `/api/v1/`
- Rate limiting applies globally to `/api/v1/` (100 req / 15 min)

### Prisma
- Import the client from `src/lib/prisma.ts`, never instantiate `PrismaClient` directly elsewhere
- Schema output is `generated/prisma/` — do not commit manual changes there
- Run `pnpm prisma migrate dev` to create migrations; never edit migration SQL by hand
- Use `prisma.config.ts` at the package root for Prisma CLI configuration

### Error Handling
- Throw `CustomError` (from `src/lib/common.ts`) for all operational errors
- Set `isOperational: true` for expected user-facing errors (4xx)
- Unhandled errors bubble to Express error middleware

### Validation (Zod)
- Validate all incoming `req.body`, `req.params`, and `req.query` with Zod schemas before hitting any service or database logic
- Co-locate Zod schemas with their route handler or in a `schemas/` subdirectory

### Authentication (better-auth)

Server-side `auth` is from `src/lib/auth.ts`. Use `auth.api.*` for all operations and `fromNodeHeaders(req.headers)` to pass headers. Forward `Set-Cookie` headers from the auth response back to the client.

```ts
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

const { headers } = await auth.api.signInEmail({
    body: { email, password },
    headers: fromNodeHeaders(req.headers),
    returnHeaders: true,
});
const cookies = headers.getSetCookie();
cookies.forEach(cookie => res.setHeader('Set-Cookie', cookie));
```

Plugins active: `expo()`, `bearer()` (dev only — remove in production), `admin({ adminRoles: ["admin"], defaultRole: "customer" })`.

Auth routes are mounted at `/api/v1/auth/` via `auth.handler` — do not duplicate auth logic in controllers.

### Middleware

Protect routes with `requireAuth` or `requireRole` from `src/middlewares/auth.middleware.ts`. After `requireAuth`, `req.user` is populated and typed.

```ts
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

router.get('/profile', requireAuth, getProfile);
router.delete('/users/:id', requireAuth, requireRole(["admin"]), deleteUser);
```

### Validation (Zod)

Use `validate(schema)` from `src/middlewares/common.ts`. Attach validated data to `req.validatedBody` — never read `req.body` directly in controllers.

```ts
import { validate } from "../middlewares/common";
import { mySchema } from "@workspace/schemas";

router.post('/resource', validate(mySchema), createResource);

// In controller — read from req.validatedBody, not req.body:
const { field1, field2 } = req.validatedBody;
```

Always import schemas from `@workspace/schemas`. Only define a local schema when it is truly route-specific and will never be shared with the web app.

### Cloudflare Images
- Use Cloudflare Images API for all user-uploaded media
- Store only the Cloudflare image ID/URL in the database, never the raw binary
- Upload logic belongs in a dedicated service (e.g., `src/services/cloudflare.ts`)

### Security (already configured in server.ts)
- `helmet` — security headers
- `cors` — configure allowed origins via env var, never `*` in production
- `express-rate-limit` — applied to all `/api/v1/` routes
- `compression` — gzip for responses > 1 KB

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Server port (default `8001`) |
| `BETTER_AUTH_SECRET` | better-auth signing secret |
| `CORS_ORIGIN` | Allowed CORS origin(s) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `CLOUDFLARE_IMAGES_TOKEN` | Cloudflare Images API token |

Copy `.env.example` (create if missing) and never commit `.env`.

## TypeScript Notes

- `"type": "module"` in `package.json` — this is ESM source
- Build output is **CJS** (`.cjs`) via tsdown for Node.js compatibility
- `tsconfig.json` extends `@workspace/typescript-config/base.json`
- `strictNullChecks` is enabled; handle `null | undefined` explicitly

## Pitfalls

- Do **not** edit files under `generated/prisma/` — they are regenerated on every `prisma generate`
- `src/index.ts` and `src/server.ts` currently both define an Express app; `server.ts` is the authoritative one (includes all middleware). Consolidate before adding new routes.
- `compression()` is applied twice in `server.ts` — remove the first bare call, keep the configured one.
- Always use `import "dotenv/config"` at the top of entry files; env vars are not auto-loaded by the runtime.
