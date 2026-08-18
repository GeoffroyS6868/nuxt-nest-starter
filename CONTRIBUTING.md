# Contributing

## Setup

1. Node.js 24.13.1 and pnpm 11+
2. `pnpm install`
3. Copy `.env.example` files in `apps/front` and `apps/back`
4. `docker compose -f docker-compose.local.yml up -d`
5. `pnpm --filter back run mikro:migrate`
6. `pnpm dev`

## Before a PR

- `pnpm lint` and `pnpm fmt:check`
- `pnpm --filter back test` when the API changes
- User-facing strings in both `en-US` and `fr-FR`
- No secrets or `.env` files

See `AGENTS.md` for repository conventions.
