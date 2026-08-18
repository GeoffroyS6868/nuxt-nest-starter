#!/bin/sh
set -e

echo "Running database migrations..."
pnpm run mikro:migrate:prod

echo "Starting application..."
exec "$@"
