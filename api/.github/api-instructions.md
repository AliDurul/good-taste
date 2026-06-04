# API Agent Instructions

## Stack

- Node.js (ESM)
- Express 5
- Prisma 7 + PostgreSQL
- Zod validation
- better-auth

## Commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm check-types
pnpm lint
pnpm test
```

## Prisma Rules

- Always import prisma from `src/lib/prisma.ts`
- Never create new `PrismaClient` instances
- Never edit `generated/prisma`
- Use migrations via:

```bash
pnpm prisma migrate dev
```

## Validation

- Validate `body`, `params`, and `query` with Zod
- Use `validate(schema)` middleware
- Read validated data from:

```ts
req.validatedBody
```

## Authentication

- Use better-auth only
- Auth routes already mounted at:

- Do not duplicate auth logic
- Use:

```ts
authenticate()
checkPermissions([...])
```

- After auth:

```ts
req.user
```

is available

## Errors

Use:

```ts
throw new CustomError(message, statusCode, isOperational);
```

## TypeScript

- ESM source
- CJS build output
- Strict mode enabled
- Handle `null` and `undefined` explicitly

## Important Pitfalls

- `server.ts` is the real entrypoint
- Remove duplicate `compression()` usage
- Add:

```ts
import "dotenv/config";
```

to entry files
- Never edit generated Prisma files