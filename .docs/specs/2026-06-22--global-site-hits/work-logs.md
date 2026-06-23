# Work Logs

## 2026-06-22 — @hta218
- Built v1: custom `site_counters` Postgres counter, seeded from `SUM(stats.views)`, incremented
  on every page load via a `BaseLayout.astro` script + `POST /api/hits.json`. Displayed in the
  home "hits" card via `SiteHits.tsx`. Merged.

## 2026-06-23 — @hta218
- Asked whether a **live visitors** count could reuse the hits work or needed its own spec.
- Verified against production Umami (`analytics.leohuynh.dev`) that the **public share token**
  exposes both realtime active visitors (`/active` → `{ x }`) and all-time pageviews
  (`/stats?startAt=0`) — **no auth credentials needed**. All-time pageviews ≈ 54k.
- Decision: **pivot hits to Umami and fold live visitors into the same card/spec.** Dropped the
  custom `site_counters` counter (Umami is more accurate, needs no DB write / increment script).
- Implemented:
  - `runtime.ts`: Umami share auth (cached ~6h, retry on 401/403) + `fetchSiteStats()`.
  - New `api/site-stats.json.ts` endpoint; new `SiteStats.tsx` island (polls 45s, hits +
    `● N online` badge).
  - Removed `api/hits.json.ts`, `SiteHits.tsx`, the BaseLayout increment script, the hits
    helpers in `stats.ts`, the `SiteHits` type, and `migration.sql`.
- `nr typecheck` → 0 errors. `site_counters` table left in Supabase (unused, can drop manually).
- Follow-up (same day): per review, **un-merged** live visitors from the hits card → its own
  `live visitors` card (pulsing dot moved to the icon slot, number kept plain for alignment), and
  **merged** `posts` + `snippets` into a single `notes` card. Grid is now `notes | hits | live`.
  Split the island into `SiteHits` (fetch once) + `LiveVisitors` (polls 30s); added a 15s TTL +
  in-flight dedup to `fetchSiteStats()` so the islands share one request.
- Same day, build-log rework: removed the home **explore** section. Turned the fake static "build
  log" snippet into a real `site.json` **manifest** (`BuildLog.tsx` island, light-themed, self-
  framed). Expanded `/api/site-stats.json` + `SiteStatsPayload` to also return `visitors` (Umami),
  `reactions` (DB `SUM`), and `commits`/`stars` (GitHub GraphQL). `loc`/`files` computed at build
  via `tinyglobby` + `readFileSync` in `index.astro`. Deleted the now-unused `studio/CodeBlock.astro`
  (only the home build log used it) and fixed its stale mention in `CodeToolbar.astro`.
  Verified live: GitHub repo (stars 381, commits 1690), glob (70 files, 9786 LOC), Umami traffic.
  `nr typecheck` → 0 errors.
- Same day, manifest enrichment: per request, added the right-sidebar + bottom-bar data to the
  manifest. New `/api/build-log.json` + `fetchBuildLog()` composes the existing rail fetchers
  (github-streak/today, token-burn, spotify, activity) on top of `fetchSiteStats()` → fields
  `github.{contributions,today}`, `tokensBurned`, `nowPlaying`, `reading`, `watching`. Added
  build-time `branch`/`lastCommit` (Vercel env → git fallback), `madeIn: "Vietnam"`, and a
  client-ticking `localTime` (Hanoi). Kept `/api/site-stats.json` lean for the cards so they don't
  pull spotify/token-burn. `nr typecheck` → 0 errors.
- Same day, trim: the enriched manifest read as repetitive (every added field is already shown in
  the rail/footer). Cut back to a **lean** snapshot — site, description, repo, stack, codebase
  (loc/files/commits/stars), traffic (hits/visitors), reactions. Removed the now-unused
  `/api/build-log.json` endpoint, `fetchBuildLog()`, `BuildLogPayload`, the ticking clock, and the
  branch/commit/git logic; `BuildLog` reuses the lean `/api/site-stats.json` again. `nr typecheck`
  → 0 errors.
