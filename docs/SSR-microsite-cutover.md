# SSR multi-microsite cutover

Public fair sites are served by **exhibition-payload’s Next.js App Router** (SSR), not the Vite `ecge-fair` SPA.

## Host → microsite

1. Set each Microsite’s **Production URL** / **Dev URL** to the public origin, e.g.:
   - Dev: `http://localhost:3000` (or `http://ecge.localhost:3000`)
   - Prod: `https://ecge.example.com`
2. Point DNS for that subdomain at the Next.js deployment.
3. Middleware sets `x-microsite-slug` from subdomain (`ecge.example.com` → `ecge`) or `?microsite=ecge` on localhost.
4. Server components validate against Payload and scope pages/posts/events.

## Local testing

**IX main site (apex):** `http://localhost:3000` — corporate homepage (no microsite).

**Fair microsites** — path-based (no subdomain needed):

```bash
npm run dev
open http://localhost:3000/m/ecge
open http://localhost:3000/m/ecge/about
open http://localhost:3000/m/ecge/en/news
curl -s http://localhost:3000/m/ecge/about | head
```

Middleware rewrites `/m/{slug}/...` → `/...` and sets `x-microsite-slug`. Nav links keep the `/m/ecge` prefix locally.

Also supported:

```bash
# query param
open http://localhost:3000/about?microsite=ecge
# lang prefix on main site or with /m/{slug}
open http://localhost:3000/en
open http://localhost:3000/m/ecge/sq/about
```

## Env

- `NEXT_PUBLIC_SERVER_URL` — CMS/admin canonical (apex)
- `ROOT_DOMAIN` — apex + `{slug}.{ROOT_DOMAIN}` microsites (see [docker-deploy.md](./docker-deploy.md))
- `PUBLIC_PROTOCOL` / `TRUST_PROXY` / `ENABLE_PATH_MICROSITES`
- Configure platforms under Admin → Globals → **IX Main Site** (microsite vs external links)
## Local Docker (safe ports)

```bash
docker compose --env-file .env.docker up --build
```

| Host port | Service |
|-----------|---------|
| **3002** | App (direct) |
| **5433** | Postgres |
| **3080** | Caddy |

Does not bind `:3000`, `:3001`, `:5432`, or `:80`. See [docker-deploy.md](./docker-deploy.md).


1. Update Microsite `productionUrl` / `devUrl` away from `:8082` to the Next origin.
2. Stop deploying `ecge-fair` web as the public site; keep the repo as UX reference only.
3. CRM/floor client islands call `/api/microsites/[slug]/crm/...` on the same Next host.

## SEO checklist

- [ ] `curl` HTML contains content (not empty `#root`)
- [ ] `/sitemap.xml` lists only that host’s microsite URLs
- [ ] `/robots.txt` points at that host’s sitemap
- [ ] Canonicals use the microsite origin
- [ ] `/en/...` and `/sq/...` set `lang` + hreflang alternates
