#!/bin/sh
set -e

echo "Running database migrations..."
prisma migrate deploy

echo "Starting API server..."
exec node dist/index.cjs
