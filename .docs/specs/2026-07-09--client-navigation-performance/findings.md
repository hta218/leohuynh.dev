# Findings: client navigation performance

Date: 2026-07-09
Branch: `perf/client-navigation-spec`
Site measured: `https://www.leohuynh.dev` and spot checks on `https://leohuynh.dev`

## Summary

The perceived slowness is caused by two different bottleneck classes:

1. **SSR/data blockers** — Astro ClientRouter cannot swap to the next page until the server returns the new document. Routes that wait on Supabase, GitHub, or private telemetry can feel frozen on first navigation, especially on cache misses or cold serverless execution.
2. **Static payload blockers** — the route is cached and has acceptable TTFB, but the fetched HTML document is large. Astro still needs to fetch and prepare the next document before the view transition swaps, so large HTML/DOM payloads can still feel slow from the persistent sidebar.

Do not treat every slow route as a data route. `/guestbook`, `/dotfiles/*`, and cache-miss `/llms` are server/data blockers. `/heatmap`, `/shelf`, and `/builds` are mostly static payload blockers.

## Current repo state when investigated

- Branch before spec: `main...origin/main`, clean.
- Created branch: `perf/client-navigation-spec`.
- Relevant framework/runtime:
  - Astro 7 project (`astro@7.0.6` installed) with `@astrojs/vercel` adapter.
  - `src/layouts/BaseLayout.astro` includes `<ClientRouter />`.
  - `astro.config.mjs` has `trailingSlash: 'never'`.
  - `StudioShell` is shared by most pages and persists a VS Code-like layout.

## ClientRouter behavior relevant to this issue

Astro prefetch support is enabled by default on pages using `<ClientRouter />`.

Facts from installed Astro types (`node_modules/astro/dist/types/public/config.d.ts`):

- `<ClientRouter />` enables prefetch by default.
- `prefetch.prefetchAll` defaults to `true` when using ClientRouter.
- Default prefetch strategy is `hover`.
- Links can override with `data-astro-prefetch="viewport"`, `"load"`, `"hover"`, `"tap"`, or `"false"`.

Implication for this site:

- Left sidebar links are visible and are often clicked quickly.
- Hover prefetch may not finish before the click.
- The UI currently has no obvious pending state while Astro fetches/prepares the next document.

## Left navigation routes in scope

Primary left explorer routes from `src/components/studio/studio-shell/lib/explorer-tree.ts` and `src/components/studio/studio-shell/Sidebar.astro`:

- `/`
- `/blog`
- latest post detail: `/blog/<latest-post>`
- `/gists`
- latest gist detail: `/gists/<latest-gist>`
- `/misc`
- latest misc detail: `/misc/<latest-misc>`
- `/whoami`
- `/takes`
- `/shelf`
- `/uses`
- `/heatmap`
- `/builds`
- `/topics`
- `/guestbook`
- `/llms`
- external stats link
- `/dotfiles` and `/dotfiles/*` from `DotfilesNav`
- `/lab`
- `/lab/travel-egypt`

## Production measurements

Measured with curl using:

```bash
curl -sS -o /dev/null -w '%{http_code} %{time_starttransfer} %{time_total} %{size_download}' https://www.leohuynh.dev/<route>
curl -sSI https://www.leohuynh.dev/<route>
```

Two hits were used for the canonical `www` host to distinguish cold-ish vs warm behavior. Earlier spot checks on apex also showed similar ordering, with extra redirects for routes without `www`.

### Canonical host route sample

| Route | Status | Median TTFB | Median total | HTML size | Classification |
| --- | ---: | ---: | ---: | ---: | --- |
| `/` | 200 | 144ms | 170ms | 166.5 KB | normal static |
| `/blog` | 200 | 206ms | 232ms | 159.8 KB | normal static |
| `/gists` | 200 | 212ms | 239ms | 167.4 KB | normal static |
| `/misc` | 200 | 185ms | 211ms | 153.9 KB | normal static |
| `/whoami` | 200 | 157ms | 221ms | 167.0 KB | normal static |
| `/takes` | 200 | 129ms | 154ms | 159.2 KB | normal static |
| `/uses` | 200 | 129ms | 158ms | 190.4 KB | moderate static payload |
| `/topics` | 200 | 194ms | 223ms | 191.7 KB | moderate static payload |
| `/shelf` | 200 | 130ms | 234ms | 296.2 KB | heavy static payload |
| `/heatmap` | 200 | 151ms | 207ms | 497.6 KB | heavy static payload |
| `/builds` | 200 | 198ms | 235ms | 298.5 KB | heavy static payload |
| `/guestbook` | 200 | 1378ms | 1614ms | 171.2 KB | SSR/data blocker |
| `/llms` | 200 | 166ms | 201ms | 209.8 KB | SSR/data route, warm cached |
| `/lab` | 200 | 199ms | 229ms | 155.9 KB | normal static |
| `/lab/travel-egypt` | 200 | 213ms | 242ms | 158.4 KB | normal static |

### Adjacent one-hop route spot checks

These routes are not direct top-level left-nav targets, but are reachable after entering `/blog` or `/topics`. They were spot-checked after Claude review flagged the omission.

| Route | Status | Median TTFB | HTML size | Note |
| --- | ---: | ---: | ---: | --- |
| `/blog/page/2` | 200 | 307ms | 159.8 KB | normal static pagination |
| `/topics/spotify` | 200 | 303ms | 154.5 KB | normal static tag page |
| `/topics/javascript` | 200 | 310ms | 158.6 KB | normal static tag page |

No new top offender was found in this small adjacent-route check. `/gists` and `/misc` detail/pagination-like routes were not separately measured in this pass; they are structurally similar to the normal static content routes and should be included if a later audit widens beyond direct left-nav targets.

### Headers and cache signals

#### `/guestbook`

- Source: `src/pages/guestbook.astro`
- `export const prerender = false`
- SSR calls `getGuestbookEntries()` in `src/lib/guestbook/queries.ts`.
- Header sample:
  - `x-vercel-cache: MISS`
  - `cache-control: public, max-age=0, must-revalidate`
  - `age: 0`
- Observed TTFB:
  - canonical `www`: ~2056ms then ~700ms in one two-hit sample.
  - apex spot check earlier: one cold-ish hit around ~5.6s, followed by ~750-850ms.
- Root cause: first paint waits on a Supabase query and serverless function execution.

#### `/dotfiles/*`

- Source: `src/pages/dotfiles/[...slug].astro`, `src/lib/dotfiles.ts`
- `export const prerender = false`
- `getDotfilesTree()` calls GitHub tree API.
- `getDotfileEntry(slug)` calls GitHub contents API.
- Cache header is intended as `public, s-maxage=3600, stale-while-revalidate=86400`, but observed response headers showed `cache-control: public`. The cause was not confirmed in repository code; treat this as observed platform/edge behavior until verified on a preview deploy.
- Observed `/dotfiles/README.md`:
  - first sample TTFB ~1455ms.
  - second sample ~136ms once cached/warm.
- Root cause: cold GitHub API fetch and serverless execution.

#### `/llms`

- Source: `src/pages/llms.astro`, `src/lib/runtime/token-burn.ts`
- `export const prerender = false`
- `fetchTokenBurnFull()` fetches private pre-aggregated JSON via GitHub raw/contents URL using `TOKEN_BURN_SUMMARY_URL` + `GITHUB_API_TOKEN`.
- Header sample after warm:
  - `x-vercel-cache: HIT`
  - `age: 102`
  - `cache-control: public`
- Observed TTFB was good while warm (~140-190ms), but cache misses still depend on a private GitHub fetch with an 8s timeout.
- Root cause class: SSR/data route with edge cache mitigation.

#### `/shelf`

- Source: `src/pages/shelf.astro`, `src/lib/media.ts`
- No `prerender = false`; page is static/prerendered.
- It renders the full books + movies lists into HTML.
- Data source at build time:
  - `getBooks()` reads Supabase if `DATABASE_URL` exists, fallback `json/books.json`.
  - `getMovies()` reads Supabase if `DATABASE_URL` exists, fallback `json/movies.json`.
- Payload contributors:
  - `json/books.json`: 87.5 KB
  - `json/movies.json`: 153.1 KB
  - rendered page HTML: ~296.2 KB
- Root cause: large DOM/HTML payload rather than server wait.

#### `/heatmap`

- Source: `src/pages/heatmap.astro`
- No `prerender = false`; page is static/prerendered.
- Reads and projects GeoJSON at build time:
  - `json/vietnam-provinces.geojson`: 104.6 KB
  - `json/neighbours.geojson`: 60.3 KB
  - `json/places.json`: 13.1 KB
- The generated SVG paths are inlined into page HTML.
- Rendered page HTML: ~497.6 KB.
- Root cause: huge inlined SVG/path/DOM payload, not DB/API wait.

#### `/builds`

- Source: `src/pages/builds.astro`, `src/components/builds/*`, `src/lib/projects.ts`
- Static route with client hydration for project metadata via `src/components/builds/hydrate`.
- Rendered page HTML: ~298.5 KB.
- Root cause: card/content payload and serialized language icon data; not a measured server blocker.

#### `/topics` and `/uses`

- `/topics`: ~191.7 KB, static, generated from content tags.
- `/uses`: ~190.4 KB, static, long hardware/software list with remote images.
- These are not top offenders but are worth targeted prefetch because they sit in the left nav.

## Source-level findings

### Shared shell cost

`src/components/studio/StudioShell.astro` runs on every StudioShell page and does:

- fetch all blog posts, snippets, and misc notes with `getCollection()` to compute latest links;
- fetch dotfiles tree with `getDotfilesTree()`;
- render sidebar, tabs, content, runtime rail, and status bar.

For prerendered/static pages this cost is paid at build time. For SSR routes (`/guestbook`, `/llms`, `/dotfiles/*`) it is paid per server render unless memoized/cached in the serverless process or CDN.

`getDotfilesTree()` has in-memory memoization, but that only helps warm serverless instance reuse. It does not fix the cold-start path where a new function instance still calls GitHub.

### Right runtime rail is not the main blocker for first route swap

`RuntimeRail` client hydration fetches live JSON after page load:

- `/api/spotify.json`
- `/api/github-streak.json`
- `/api/github-today.json`
- `/api/activity.json`
- `/api/token-burn.json`

These can affect post-swap network activity and rail content, but they are not the main blocker for the document swap itself. The document swap waits on the route HTML.

### No clear loading feedback

The shell currently initializes folders/tabs/rail in `src/components/studio/studio-shell/client/boot.ts`, but there is no navigation pending indicator using Astro transition lifecycle events.

Likely useful events:

- `astro:before-preparation` — mark navigation pending.
- `astro:after-swap` and/or `astro:page-load` — clear pending.

## Route priority list

### Highest priority

1. `/guestbook`
   - Measured slowest first-click route.
   - True SSR/data blocker.
   - User-facing wait can be removed by deferring entries to client/API or caching anonymous HTML/API.

2. `/dotfiles/*`
   - GitHub-backed SSR with cold first-hit latency.
   - May also affect every SSR shell render through `getDotfilesTree()`.

3. `/heatmap`
   - Biggest static HTML payload (~498 KB).
   - Likely obvious on client transition because document preparation must parse a large SVG-heavy document.

### Medium priority

4. `/shelf`
   - Heavy static HTML (~296 KB) due full books/movies list.

5. `/builds`
   - Heavy static HTML (~299 KB), lower data risk.

6. `/llms`
   - SSR/data route but cache works well when warm.
   - Keep as monitored risk; optimize if users see cache-miss stalls.

### Lower priority

7. `/topics`, `/uses`
   - Moderate payload around ~190 KB.
   - Prefetch is probably enough unless future content grows.

## Key conclusion

The immediate product issue is not only raw backend performance. The user experience lacks visible navigation feedback and relies on hover prefetch that may not finish before a quick sidebar click.

The first implementation should therefore combine:

1. shell-level pending feedback,
2. targeted sidebar prefetch for known heavy routes,
3. then route-specific blocker removal starting with `/guestbook`.
