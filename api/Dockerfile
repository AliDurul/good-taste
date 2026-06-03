# syntax=docker/dockerfile:1
# Build from the monorepo root:
#   docker build -f apps/api/Dockerfile -t goodtaste-api:prod .

# --- Stage 1: base -----------------------------------------------------------
FROM node:20-alpine AS base
RUN apk update && apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

# --- Stage 2: prepare (turbo prune) ------------------------------------------
FROM base AS prepare
RUN npm install -g turbo@^2
WORKDIR /app
COPY . .
RUN turbo prune api --docker

# --- Stage 3: builder ---------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=prepare /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=prepare /app/out/full/ .
RUN cd apps/api && pnpm exec prisma generate
RUN pnpm turbo build --filter=api
RUN pnpm --filter=api deploy --prod /standalone

# --- Stage 4: runner ----------------------------------------------------------
FROM node:20-alpine AS runner
RUN apk update && apk add --no-cache libc6-compat
RUN npm install -g prisma@7.8.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 --ingroup nodejs nodejs
WORKDIR /app
COPY --from=builder /standalone/node_modules ./node_modules
COPY --from=builder /standalone/package.json ./package.json
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
RUN mkdir -p uploads && chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 8001
ENTRYPOINT ["/app/entrypoint.sh"]
