# output: 'standalone' is set in next.config.ts
# DB migrations run via prodMigrations in payload.config.ts on boot

FROM node:24-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
# Prefer install over ci: lockfile may lag peer deps across npm majors (Node 24 image)
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time placeholders — real secrets come from runtime env
ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/payload
ARG PAYLOAD_SECRET=build-time-secret-change-me
ARG NEXT_PUBLIC_SERVER_URL=http://localhost:3000
ARG ROOT_DOMAIN=
ARG PUBLIC_PROTOCOL=http
ENV DATABASE_URL=$DATABASE_URL \
    PAYLOAD_SECRET=$PAYLOAD_SECRET \
    NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL \
    ROOT_DOMAIN=$ROOT_DOMAIN \
    PUBLIC_PROTOCOL=$PUBLIC_PROTOCOL \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build && mkdir -p public

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
RUN mkdir -p public/media media \
  && chown -R nextjs:nodejs public media

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chmod=755 docker/entrypoint.sh /entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "server.js"]
