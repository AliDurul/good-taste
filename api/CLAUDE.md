# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Commands

This is a pnpm workspace package (run from `api/`).

- `pnpm dev` — run the API with hot reload (tsx watch on `src/index.ts`)
- `pnpm build` — `prisma generate` then bundle with tsdown to `dist/`
- `pnpm start` — run the built `dist/index.cjs`
- `pnpm check-types` — `tsc --noEmit`
- `pnpm lint` — eslint over `src/`, zero warnings allowed
- `pnpm db:generate` — regenerate the Prisma client (output goes to `generated/prisma`, gitignored)
- `pnpm db:migrate` — create/apply a dev migration (`prisma migrate dev`)
- `pnpm db:studio` — open Prisma Studio
- `pnpm db:seed` — run `prisma/seed.ts` (erases and reseeds categories, products, loyalty tiers, wallet config, admin user, etc.)

There is no test runner configured (`supertest`/`ts-node` are present as devDependencies but unused so far).

## Architecture

Express 5 API (`src/index.ts` → `src/server.ts`) backed by Prisma 7 + Postgres (`@prisma/adapter-pg`), with auth/RBAC via **Better Auth**.

### Request pipeline
- `src/server.ts` builds the Express app: CORS (from `TRUSTED_ORIGINS`), Better Auth's handler mounted at `/api/v1/auth/*` (via `toNodeHandler`), static `/api/v1/uploads`, rate limiting (100 req/15min on `/api/v1`), compression, `express.json()`.
- `src/index.ts` wires `/health`, mounts `src/routes/index.ts` at `/api/v1`, then `notFound` + `errorHandler` from `src/middlewares/common.ts`.
- Every feature route is mounted in `src/routes/index.ts` behind `authenticate` (from `src/middlewares/auth.middleware.ts`), which loads the Better Auth session and rejects unauthenticated/banned users, populating `req.user`.

### Auth & RBAC (Better Auth)
- `src/lib/auth.ts` configures Better Auth: Prisma adapter, custom `User` fields (phone, address, walletBalance, totalSpend, referralCode, tierId, role, etc.), the `expo`/`bearer`/`openAPI`/`admin` plugins, session settings, and a `databaseHooks.user.create.after` hook that bootstraps new `customer` users into the Bronze loyalty tier (creates a `TierHistory` row and a referral code via `generateReferralCode()` from `src/lib/utils.ts`).
- `src/lib/permissions.ts` defines the access-control statements and four roles — `admin`, `agent`, `officer`, `customer` — each with per-resource (`product`, `order`, `category`, `walletTransaction`, `walletConfig`, `loyaltyTier`, `promotion`, `user`) CRUD-style permissions.
- Route-level authorization uses `checkPermission({ resource: ['action'] })` from `auth.middleware.ts`, which calls `auth.api.userHasPermission`.
- The `User` model and Better Auth tables (`Session`, `Account`, `Verification`) in `prisma/schema.prisma` are managed by Better Auth — do not change their shape without understanding the migration impact (comment in the schema warns explicitly).

### Controller/route/schema pattern
Each domain (e.g. `product`, `order`, `category`, `loyalty-tier`, `wallet-config`, `wallet-transaction`, `user`, `session`) follows the same triplet:
- `src/routes/<domain>.route.ts` — declares an Express `Router`, chains middleware (`parsePagination()`, `validate(schema)`, `checkPermission(...)`, `upload.single(...)`) and binds to controller functions.
- `src/controllers/<domain>.controller.ts` — `RequestHandler`s that talk to Prisma directly (`src/lib/prisma.ts`), throw `CustomError(message, statusCode, isOperational)` for expected failures, and respond with `{ success, data, ... }` (list endpoints also include a `pagination` block from `req.pagination`).
- `src/schemas/*.ts` (re-exported via `src/schemas/index.ts`) — Zod schemas used by the `validate` middleware for request body validation.

`src/middlewares/common.ts` provides the shared cross-cutting pieces: `notFound`/`errorHandler` (handle `CustomError`, Better Auth `APIError`, Prisma validation errors), `parsePagination()` (sets `req.pagination = { page, limit, skip }`), `validate(schema)` (Zod parse → `req.validatedBody`, returns structured 400 on `ZodError`), and `upload` (multer disk storage to `uploads/`).

### Domain model (prisma/schema.prisma)
- **Catalogue**: `Category` → `Product`. Product carries commercial fields directly (price, weightKg, earnValue, stock fields) — variants were merged into `Product` (see migration `20260608000000_merge_variant_into_product`).
- **Orders**: `Order` → `OrderItem` (price/earnValue snapshots taken at order time, never recalculated retroactively), plus a `QRCode` used for delivery confirmation/wallet crediting.
- **Loyalty**: `User.walletBalance`/`totalSpend` drive `LoyaltyTier` (Bronze/Silver/Gold) via `tierId`; `TierHistory` logs tier changes; `WalletTransaction` logs wallet credits/debits with a running `balance` snapshot and optional `expiresAt`/`isExpired`. `WalletConfig` is a singleton (`key = "global"`) holding earn rate, expiry months, and referral bonus amounts.
- **Promotions**: `Promotion` (percentage/fixed discount, free delivery, double points, bundle) targets tiers (`PromotionTargetTier`) and/or categories (`PromotionTargetCategory`), or requires specific products (`PromotionBundleItem`).

### Order business logic (src/services/order.services.ts)
Order creation/preview flows compose these helpers:
- `buildLineItems(items)` — validates products are active and in stock, returns product data.
- `findApplicablePromotion(customerId, productIds)` — picks the best active promotion for the customer's tier (and, for `bundle` type, checks all required products are present).
- `applyPromotion(promotion, totalAmount)` — computes `discountAmount`, `isFreeDelivery`, `earnMultiplier` based on promotion type.
- `getWalletExpiry()` — reads `WalletConfig.expiryMonths` to compute a wallet-credit expiry date.
- `checkAndUpdateTier(tx, customerId, totalSpend)` — inside a Prisma transaction, finds the highest qualifying `LoyaltyTier` by `totalSpend`, updates `User.tierId`, and writes a `TierHistory` entry with reason `initial`/`upgrade`/`downgrade`.

`previewOrder()` and `createOrder()` (`src/controllers/order.controller.ts`) both call `buildLineItems`, `findApplicablePromotion`, and `applyPromotion`; `createOrder()` additionally runs the tier-check/wallet logic inside a transaction.

### Type augmentation
`src/types/global.d.ts` extends Express's `Request` with `validatedBody`, `user`/`session` (typed from `auth.$Infer.Session`), and `pagination`.

### Build output
`tsdown` bundles `src/**/*` (excluding tests) to CJS in `dist/`, with `.cjs` extensions; `pnpm build` runs `prisma generate` first so the generated client (`generated/prisma`) is available to the bundler.
