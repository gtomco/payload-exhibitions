# ECGE static site → React/Payload gap audit

Last updated: 2026-07-10. Compares vanilla `app.js` with `ecge-fair/web` + `exhibition-payload`.

## Legend

| Status | Meaning |
|--------|---------|
| Done | Implemented and wired |
| Partial | Shell exists; content or behaviour incomplete |
| CMS shell | Payload page seeded; placeholder blocks only |
| Missing | Not implemented |
| CRM | Data from sales-crm (not Payload) |
| Legacy | Still from `legacy-public.json` |

---

## Pages (21 public views)

| View | Static source | Current state | Next build step |
|------|---------------|---------------|-----------------|
| **home** | `settings`, hero video, gateways, floor preview, ads, news, sponsors | **Partial** — hero, countdown, video slideshow, gateways, floor preview (CRM), news, sponsors strip | CMS: hero video + gallery block; stats/pillars blocks; horizontal ad block |
| **about** (3 tabs) | `aboutPage` HTML, synopsis reports, contacts | **CMS shell** — single page; no tabs | 3 pages (`about`, `about-synopsis`, `about-contacts`) + rich content from `legacy-public.json` |
| **categories** | Hardcoded 7 sectors + image | **CMS shell** | Sector list block or 7 category entries; keep shared block for all fairs |
| **energy / construction / green-economy** | Hardcoded sector landings + images | **CMS shell** (3 pages seeded) | Sector landing block template (hero + bullets + image) |
| **program** | `agenda[]` | **Partial** — `ProgramPage` uses Payload events, legacy agenda fallback | Seed events in Payload; optional retire legacy agenda |
| **prices** | `priceList.space` + `partners` | **CMS shell** | Price table block (reusable) + seed from `legacy-public.json` |
| **floor** | `booths`, `floorPlan`, tabs, zoom | **Partial** — CRM map, lists; no zoom/pan, no package tab data | CRM booking link; floor toolbar; booth packages from CRM area types |
| **exhibitors** | Directory + profile + AI matchmaker | **Partial** — search list from CRM | Exhibitor profiles, logos, B2B link, matchmaker (CRM/API) |
| **partners** | Sponsor wall + packages | **CMS shell** | Sponsor grid block + `priceList.partners` |
| **news** | `news[]` grid | **Partial** — Payload posts + detail view | Migrate/archive posts; images |
| **gallery** | `mediaAssets` gallery types | **CMS shell** | Gallery block with media from Payload |
| **media** | `mediaAssets` by type | **CMS shell** | Media list block |
| **faq** | Hardcoded Q&A in `app.js` | **CMS shell** | FAQ accordion block (reusable) |
| **contact** | `contactPage` cards + form | **CMS shell** | Contact cards block + Payload form block |
| **visitor** | Form → `/api/visitors` + ticket | **CMS shell** | Visitor form (Payload form builder) + ticket integration |
| **exhibitor** | Form + booth select | **CMS shell** | Link to CRM public floor plan / booking |
| **portal** | Login, dashboards, tickets | **Missing** | CRM auth + portal routes |
| **legal / privacy** | Structured settings pages | **CMS shell** | Seed from `legalNotice` / `privacyPolicy` |
| **ticket.html** | QR ticket page | **Missing** | Standalone route + CRM visitor record |

---

## Global chrome (all pages)

| Element | Static | Current | Next |
|---------|--------|---------|------|
| Mega-menu nav | Hardcoded | **Done** — Payload navigation (seeded) | Editor tweaks only |
| Language toggle SQ/EN | `copy()` + labels | **Done** | Optional Payload labels global |
| Calendar overlay | Hardcoded + `eventSchedule` | **Missing** | Calendar modal component + settings dates |
| Site search panel | Hardcoded index | **Missing** | Payload search plugin on microsite |
| Sponsor popup | `sponsorAds`, timing | **Missing** | Popup settings on microsite settings |
| Floating visitor/exhibitor CTAs | Hardcoded | **Missing** | Optional microsite settings flags |
| AI chat widget | Heuristic replies | **Missing** | Out of scope unless requested |
| SEO / JSON-LD | `settings.seo` | **Missing** | Per-page SEO from Payload (plugin exists) |
| Theme colours | `settings.theme` | **Partial** — microsite theme + legacy | Theme global per microsite |

---

## Home sections (static `homeView`)

| Section | In static HTML | In React today |
|---------|----------------|----------------|
| Hero stage + countdown | Yes | Yes |
| Hero video / demo slideshow | Yes | Yes (legacy images) |
| Gateway cards | Yes | Yes |
| Floor preview strip | Yes | Yes (CRM) |
| Horizontal ad banner | Yes | **Missing** |
| Recent news | Yes | Yes (Payload) |
| Sponsors strip | Yes | Yes (legacy media) |
| Live stats (`content.stats`) | In JSON, not rendered in static either | **Missing** |
| Pillars (`content.pillars`) | In JSON, not rendered in static either | **Missing** |
| Featured exhibitors | Function exists, unused in static | **Missing** |
| Program highlights | Function exists, unused | **Missing** |
| Future band | Function exists, unused | **Missing** |
| Contact footer on home | Yes | **Partial** — global footer only |

---

## Payload blocks — have vs need

| Block | Have | Need for parity |
|-------|------|-----------------|
| Content (columns) | Yes | — |
| Media | Yes | — |
| Gallery / slideshow | Yes | Seed home + gallery pages |
| Banner | Yes | — |
| CTA | Yes | Gateway cards, sector CTAs |
| Form | Yes | Visitor, contact, exhibitor |
| Archive | Yes | News on pages |
| **Stats row** | No | Home `content.stats` |
| **Pillars / sector cards** | No | Home `content.pillars` |
| **Sponsor grid** | No | Home + partners |
| **Price table** | No | Prices + partners |
| **FAQ accordion** | No | FAQ page |
| **Contact card grid** | No | Contact + about-contacts |
| **Sector landing** | No | energy / construction / green-economy |
| **Synopsis report** | No | about-synopsis (year, gallery, HTML body) |
| **Horizontal ad** | No | Home ad banner |

---

## Data sources

| Data | Should come from | Today |
|------|------------------|-------|
| Booths, floor plan, booking | **sales-crm** | Payload CRM API proxy (**Partial**) |
| Pages, hero, copy, images | **Payload** | Seeded shells (**Partial**) |
| News | **Payload posts** | Yes |
| Program | **Payload events** | Partial + legacy agenda |
| Sponsors / gallery media | **Payload media** | Legacy `mediaAssets` |
| Prices / packages | **Payload** (or CRM area types) | Legacy `priceList` / `boothPackages` |
| Visitor/exhibitor submissions | **CRM or forms API** | Not wired |
| Nav | **Payload microsite settings** | Seeded |

---

## Recommended seed/build order

1. **CRM event picker** — select “Energy 2026” in Microsite Settings (no UUID paste).
2. **Rich home page** in Payload — gallery slideshow, stats, pillars, sponsor grid, horizontal ad.
3. **About trilogy** — overview HTML, synopsis reports, contact cards from `legacy-public.json`.
4. **Shared blocks** — FAQ, price table, contact cards, sector landing (one block, three pages).
5. **Gallery / media / partners** — gallery block + sponsor grid; upload media to Payload.
6. **Forms** — visitor + contact via Payload form builder; exhibitor → CRM floor plan.
7. **Floor polish** — zoom/pan, area types as package cards from CRM.
8. **Portal + ticket** — CRM auth integration.
9. **Global overlays** — calendar, search, sponsor popup.

---

## Run seed

```bash
cd exhibition-payload
npm run payload migrate   # if pending
npm run seed:ecge         # pages + nav; auto-links CRM event matching "Energy"
```

Then in admin: **Microsite Settings → CRM exhibition event** → search “Energy 2026”.
