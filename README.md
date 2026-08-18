# Nuxt Nest Starter

pnpm + Turborepo template extracted from the [sarpbc](https://github.com/sarpbc/sarpbc) stack: Nuxt 4, NestJS (Fastify), MikroORM, PostgreSQL, Redis, and cookie JWT auth.

- `apps/front`: Nuxt 4 SSR website (port **4000**)
- `apps/back`: NestJS API (port **4001**)

Shared packages live under `packages/` as `@starter/*`. Rename the scope when you fork.

## Prerequisites

- Node.js 24.13.1 (see `.nvmrc`)
- pnpm 11+
- Docker and Docker Compose for local Postgres and Redis

## Install

```bash
pnpm install
cp apps/front/.env.example apps/front/.env
cp apps/back/.env.example apps/back/.env
```

## Run locally

```bash
docker compose -f docker-compose.local.yml up -d
pnpm --filter back run mikro:migrate
pnpm dev
```

- Front: http://localhost:4000
- API: http://localhost:4001/health

Register on the front, then promote yourself to staff if you need API permissions:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'you@example.com';
```

Roles are `admin` (all permissions) and `editor` (`content.manage`). Edit the matrix in `apps/back/src/user/domain/staff-access.ts` and `packages/types/src/user.ts`.

## Scripts

| Script                        | What it does    |
| ----------------------------- | --------------- |
| `pnpm dev`                    | Run all apps    |
| `pnpm dev:front` / `dev:back` | One app         |
| `pnpm build`                  | Build all       |
| `pnpm lint` / `pnpm fmt`      | oxlint / oxfmt  |
| `pnpm test:back`              | Jest unit tests |

## Auth

Browser sessions use an httpOnly `access_token` cookie. Front calls Nest directly (`NUXT_PUBLIC_API_BASE`) with `credentials: "include"`. There is no Nitro API proxy.

Optional Google OAuth: set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` on the API and `NUXT_PUBLIC_GOOGLE_AUTH=true` on the front.

## Adding a feature

1. New Nest module under `apps/back/src/<feature>/` (entity, repository, service, controller, DTOs).
2. Register the entity in `mikro-orm.entities.ts` and create a migration (`pnpm --filter back mikro:migrate:create`).
3. Shared types go in `packages/types`.
4. Nuxt pages consume the API with `apiFetch`. Staff routes: `@RequirePermissions()` + `PermissionGuard` on the API.

## License

MIT
