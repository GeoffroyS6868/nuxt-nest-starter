# syntax=docker/dockerfile:1.7

# Monorepo context: always build from repository root (--file apps/back/Dockerfile).
FROM node:24.22.3-alpine AS base

RUN apk upgrade --no-cache \
  && npm install -g pnpm@12.23.0

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
COPY apps/back/package.json ./apps/back/package.json
COPY packages/composables/package.json ./packages/composables/package.json
COPY packages/types/package.json ./packages/types/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY packages/utils/package.json ./packages/utils/package.json

# Include ./packages/utils... so utils gets its own workspace links
# (utils → @starter/types). `--filter ./apps/back...` alone links packages into
# apps/back/node_modules only; nest/tsc then fails resolving imports from
# packages/utils/src/*.ts.
RUN --mount=type=cache,target=/pnpm/store,id=pnpm-store-back \
    pnpm install --frozen-lockfile --store-dir=/pnpm/store \
      --filter ./apps/back... \
      --filter ./packages/utils...

FROM base AS build

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
COPY packages ./packages
COPY apps/back ./apps/back

RUN --mount=type=cache,target=/pnpm/store,id=pnpm-store-back \
    pnpm install --frozen-lockfile --store-dir=/pnpm/store \
      --filter ./apps/back... \
      --filter ./packages/utils...

RUN pnpm --filter ./apps/back run build \
  && test -f /app/apps/back/dist/mikro-orm.config.js \
  && test -f /app/apps/back/dist/main.js \
  && test -d /app/apps/back/dist/migrations \
  && chmod +x /app/apps/back/entrypoint.sh

RUN --mount=type=cache,target=/pnpm/store,id=pnpm-store-back \
    rm -rf /app/node_modules /app/apps/back/node_modules /app/packages/utils/node_modules \
    && pnpm install --frozen-lockfile --prod --store-dir=/pnpm/store \
      --filter ./apps/back... \
      --filter ./packages/utils...

FROM node:24.22.3-alpine AS runtime

ENV NODE_ENV=production

ARG APP_RELEASE=unknown

# Keep pnpm for the package scripts; drop npm, corepack and yarn and their CVEs.
RUN apk upgrade --no-cache \
  && npm install -g pnpm@12.23.0 \
  && rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
    /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
    /opt/yarn-* /usr/local/bin/yarn /usr/local/bin/yarnpkg \
  && addgroup -g 1001 -S app \
  && adduser -S -u 1001 -G app app

WORKDIR /app

COPY --from=build --chown=app:app /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=build --chown=app:app /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/packages ./packages
COPY --from=build --chown=app:app /app/apps/back ./apps/back

LABEL org.opencontainers.image.revision="${APP_RELEASE}"

USER app

WORKDIR /app/apps/back

ENTRYPOINT ["/app/apps/back/entrypoint.sh"]
EXPOSE 4001

CMD ["pnpm", "run", "start:prod"]
