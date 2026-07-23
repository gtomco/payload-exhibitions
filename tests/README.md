# E2E & API test suite

Automated tests for Payload CMS + ECGE React microsite. Nothing is left to chance — every major resource is created, read, updated, and deleted via API; admin UI create/edit is exercised separately.

## Run

```bash
# From exhibition-payload (starts Payload :3001 + React :8082 if not running)
npm run test:e2e          # all 29 tests
npm run test:e2e:api      # REST + microsite context (16 tests)
npm run test:e2e:admin    # Payload admin UI (8 tests)
npm run test:e2e:microsite # React frontend (5 tests)
```

Environment (optional):

```bash
PAYLOAD_URL=http://localhost:3001
MICROSITE_URL=http://localhost:8082
```

## What is covered

### API (`api-resources.crud.e2e.spec.ts`)

| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| microsites | ✓ | ✓ | ✓ | ✓ |
| categories | ✓ | ✓ | ✓ | ✓ |
| posts (ECGE scoped) | ✓ | ✓ | ✓ | ✓ |
| pages (ECGE scoped) | ✓ | ✓ | ✓ | ✓ |
| events (ECGE scoped) | ✓ | ✓ | ✓ | ✓ |
| media (upload) | ✓ | ✓ | ✓ | ✓ |
| redirects | ✓ | ✓ | ✓ | ✓ |
| forms | list/read | | | |
| search index | list | | | |
| globals (header/footer/theme) | | read | update | |
| GraphQL | query | | | |
| Public unauthenticated reads | ✓ | | | |

### Microsite context (`microsite-context.e2e.spec.ts`)

- ECGE metadata from `/api/microsites/ecge/context`
- Post isolation between microsites
- CORS preflight for `localhost:8082`

### Admin UI (`admin-resources.crud.e2e.spec.ts`)

- Create + edit via Payload admin for categories, microsites, posts, pages, events
- Media upload via admin
- All collection list views reachable
- Globals header/theme editable
- Cleanup via API (reliable delete)

### React microsite (`microsite-frontend.e2e.spec.ts`)

- Home shell renders (header, hero, countdown, footer)
- Payload context proxy works
- Language toggle
- Header dropdown navigation
- Legacy booth data on floor preview

## Test user

Seeded automatically: `dev@payloadcms.com` / `test`

## Reports

HTML report: `npx playwright show-report` after a run.
