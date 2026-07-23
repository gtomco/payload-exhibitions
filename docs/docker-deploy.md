# Docker deploy — IX apex + microsite subdomains

One Next.js + Payload container serves the corporate site and all fair microsites. Host header selects the surface.

## Where does the data come from?

Everything (users, pages, microsites, main-site globals) lives in **Postgres** via `DATABASE_URL`.

| How you start | Database | `/admin` |
|---------------|----------|----------|
| `npm run dev` with [`.env`](../.env) | Your real DB (e.g. remote) | Existing users |
| Docker with `DATABASE_URL` from `.env` | Same real DB | Existing users |
| Docker `--profile with-db` and no `DATABASE_URL` | Empty bundled Postgres on `:5433` | “Create first user” |

The empty-DB prompt is expected for the bundled Postgres — it is a new volume, not a missing seed of your remote data.

## Connect Docker to your existing database

Use the same `DATABASE_URL` + `PAYLOAD_SECRET` as local dev (from `.env`):

```bash
# Stops using the empty compose Postgres; app talks to your real DB
docker compose --env-file .env --env-file .env.docker up --build app caddy
```

Order matters: `.env.docker` overrides ports/`ROOT_DOMAIN`, while `.env` supplies `DATABASE_URL` and `PAYLOAD_SECRET`.

Or set explicitly in `.env.docker`:

```bash
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=disable
PAYLOAD_SECRET=same-as-your-dot-env
```

Then:

```bash
docker compose --env-file .env.docker up --build app caddy
```

## Empty local DB (smoke / fresh install)

```bash
docker compose --env-file .env.docker --profile with-db up --build
```

| Host port | Service |
|-----------|---------|
| **3002** | App (direct) |
| **5433** | Bundled Postgres only with `--profile with-db` |
| **3080** | Caddy |

Does not bind `:3000`, `:3001`, `:5432`, or `:80`.

Then:

- IX apex: `http://localhost:3002` or `http://lvh.me:3002`
- Via Caddy: `http://lvh.me:3080`
- Microsite: `http://ecge.lvh.me:3002` (needs a Microsite slug `ecge` in that DB)

[`lvh.me`](https://lvh.me) resolves to `127.0.0.1` and supports subdomains.

## Env contract

| Variable | Role |
|----------|------|
| `DATABASE_URL` | Postgres connection string (source of all CMS data) |
| `PAYLOAD_SECRET` | JWT/crypto secret — keep stable per database |
| `ROOT_DOMAIN` | Apex + `{slug}.{ROOT_DOMAIN}` microsites |
| `PUBLIC_PROTOCOL` | `http` / `https` for derived origins |
| `NEXT_PUBLIC_SERVER_URL` | Canonical apex URL (may include port locally) |
| `TRUST_PROXY` | Use `X-Forwarded-*` behind Caddy |
| `ENABLE_PATH_MICROSITES` | Allow `/m/{slug}` (keep `true` locally) |
| `SMTP_HOST` | Outbound SMTP host for visitor ticket emails (omit for Ethereal/dev) |
| `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | SMTP connection |
| `SMTP_FROM_ADDRESS` / `SMTP_FROM_NAME` | From header on ticket emails |
| `SMTP_SECURE` | `true` for port 465 |
| `SMTP_SKIP_VERIFY` | Skip SMTP verify on boot |

Microsite `productionUrl` / `devUrl` are **optional**. Empty → derive from `ROOT_DOMAIN`.

## Visitor tickets & entrance check-in

1. Set SMTP_* so confirmation emails deliver (QR is an `<img src>` to `/api/visitors/ticket/{token}/qr`; PDF is attached).
2. In **Microsite Settings**, upload a **logo**, set **CRM exhibition event**, and set a **check-in PIN** (4–8 digits).
3. Public registration: `/{microsite}/visitor` (or subdomain `/visitor`).
4. Staff kiosk: `/check-in` on the microsite host (PIN unlock).
5. Admin scanner: `/admin/visitor-check-in` (logged-in users). Seeded ECGE PIN default: `2468`.

## Production sketch

1. Point DNS `A/AAAA` for `ROOT_DOMAIN`, `www.ROOT_DOMAIN`, and `*.ROOT_DOMAIN` at the server.
2. Set `DATABASE_URL` to your managed Postgres, `PUBLIC_PROTOCOL=https`, `TRUST_PROXY=true`, `ENABLE_PATH_MICROSITES=false`.
3. Set `NEXT_PUBLIC_SERVER_URL=https://i-exhibitions.com` (non-www apex).
4. Configure real `SMTP_*` and `CRM_*` for visitor tickets / CRM sync.
5. Do **not** use `--profile with-db` unless you want Postgres in Compose.
6. Enable the TLS block in [`docker/Caddyfile`](../docker/Caddyfile) (www → apex **301**, then reverse proxy).
7. `docker compose --env-file .env.prod up -d --build app caddy`
8. Run migrations; seed/update MainSite SEO titles; set check-in PINs; upload OG / apple-touch assets if needed.

Admin: `https://{ROOT_DOMAIN}/admin`

## SEO go-live checklist

1. Confirm `www` **301** → apex (`curl -I https://www.i-exhibitions.com`).
2. Check `/robots.txt` and `/sitemap.xml` on apex and on one microsite host (host-scoped URLs).
3. View-source on `/` and `/en`: title, canonical, `hreflang` (`sq` / `en` / `x-default`), `apple-touch-icon`, no `X-Powered-By`.
4. Spot-check news/event pages for `NewsArticle` / `Event` JSON-LD.
5. Confirm `/check-in` is `noindex` and disallowed in robots.
6. Google Search Console: domain property (or apex + microsite hosts); submit each `/sitemap.xml`.
7. Re-run [Seobility](https://www.seobility.net/) on `https://i-exhibitions.com/` — expect www duplicate, short title/H1, and empty-alt warnings cleared.
