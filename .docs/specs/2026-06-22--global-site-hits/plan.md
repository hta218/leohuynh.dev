# Plan: Site Stats — Hits, Live Visitors, Build-log Manifest

## Goal

Two surfaces on the home page, sharing one live endpoint:

1. **Stat cards** (3-card grid): `notes` (posts+snippets, build-time), `hits` (Umami all-time
   pageviews), `live visitors` (Umami active now, with a pulsing dot in the icon slot).
2. **Build-log manifest** — the "build log" section renders a JSON `site.json` manifest mixing
   build-time facts (content counts, LOC, files, stack) with live numbers (traffic, reactions,
   repo commits/stars). Light-themed, self-framed code block.

Same graceful-degradation rule everywhere: any unavailable source renders `—`/`…` and never
fakes a number.

## Why Umami (pivot from v1)

The v1 plan built a custom `site_counters` Postgres row, seeded from `SUM(stats.views)` and
incremented on every page load. We pivoted after verifying — with a live `curl` against the
production Umami — that the **public share link already exposes everything we need, with no auth
credentials**:

- `GET {base}/api/share/{shareId}` → `{ websiteId, token }` (a read-only share JWT, no `exp`).
- `GET {base}/api/websites/{id}/active` + header `x-umami-share-token` → `{ x: <online> }`.
- `GET {base}/api/websites/{id}/stats?startAt=0&endAt=<now>` → `{ pageviews: { value }, … }`
  (all-time total, e.g. ~54k pageviews).

The original spec had rejected Umami "because it needs API auth" — the share-token flow disproves
that. Umami's numbers are also more accurate (bot filtering, dedup) than a raw page-load counter,
and require **no DB write path, no client increment script, no migration**. So the custom counter
is removed entirely.

The share link lives in code already: `SITE.analytics.umamiShareUrl`
(`https://analytics.leohuynh.dev/share/<shareId>/leohuynh.dev`). We parse the base + shareId from
it — nothing new in env. `PUBLIC_UMAMI_WEBSITE_ID` stays as-is for the tracking script.

## Server — `src/lib/runtime.ts`

Umami share auth + a `fetchSiteStats()` orchestrator, mirroring the existing integration fetchers
(`fetchSpotifyStatus`, etc.): `try/catch`, `timeoutSignal()`, graceful per-source fallback.

- `parseUmamiShare()` / `getUmamiShareAuth()` / `umamiWebsiteFetch()` — public share-token flow,
  token cached ~6h in-module (share JWT has no `exp`), re-resolved once on 401/403.
- `fetchUmamiTraffic()` → `{ hits, online, visitors }` from `/active` + `/stats?startAt=0`
  (handles Umami v1 `{ x }` / v2 `{ visitors }` active shapes).
- `fetchGithubRepoStats()` → `{ commits, stars }` via the existing `githubGraphql()` helper
  (`repository.stargazerCount` + `defaultBranchRef…history.totalCount`).
- `fetchTotalReactions()` → `SUM(loves+applauses+ideas+bullseyes)` over `stats` via `getSql()`.
- `fetchSiteStats()` — `Promise.all` of the three; each source degrades to `null` independently;
  `ok` is true if any number resolved.

## Endpoint — `src/pages/api/site-stats.json.ts` (new)

`prerender = false`, `GET` → `fetchSiteStats()`, `jsonHeaders(30)` (30s shared cache). One endpoint
feeds all three islands.

## Types — `src/types/integrations.ts`

```ts
export interface SiteStatsPayload {
  ok: boolean
  hits: number | null
  online: number | null
  visitors: number | null
  reactions: number | null
  commits: number | null
  stars: number | null
  error?: string
}
```

## Client helper — `src/lib/stats.ts`

`fetchSiteStats(): Promise<SiteStatsPayload>` — GET `/api/site-stats.json` with a 15s TTL cache +
in-flight dedup, so all three islands share one request.

## Display

### Stat grid (`index.astro`) — 3 cards

1. **notes** — `posts.length + snippets.length` (static). Icon `markdown`.
2. **hits** — `<SiteHits client:idle />`: all-time pageviews, fetched once. Icon `analytics`.
3. **live visitors** — `<LiveVisitors client:idle />`: active visitors, polls ~30s. The pulsing
   green dot sits in the **icon slot** (replacing an icon); the big number stays plain so it
   aligns with the other two cards. Label `live visitors`.

### Build-log manifest — `src/components/widgets/BuildLog.tsx` (new island)

Self-framed light code block (header + traffic-light dots + `<pre>`, so no stray slot whitespace)
rendering a **lean** `site.json` manifest. Deliberately scoped to facts NOT already shown elsewhere
on the page — the rail covers spotify/github/activity, the footer covers branch/commit/clock — so
it stays a codebase + traffic snapshot rather than restating the whole UI. Build-time facts arrive
as props; live numbers hydrate from `/api/site-stats.json` (shared with the cards) and poll ~30s
(`…` until resolved). GitHub-light syntax palette.

```jsonc
{
  "site": "leohuynh.dev",
  "description": "documenting the work, one note at a time",
  "repo": "hta218/leohuynh.dev",                            // build-time
  "stack": ["astro", "bun", "tailwind", "typescript"],      // build-time
  "stats": { "loc": N, "files": N,                          // loc/files build-time (glob)
             "commits": N, "stars": N,                      // commits/stars live (github)
             "hits": N, "visitors": N,                      // live (umami)
             "reactions": N }                               // live (db sum)
}
```

`loc` / `files` are computed in `index.astro` frontmatter via `tinyglobby` + `readFileSync` over
`src/**` + `content/**` (page is prerendered → once per build, not per request).

> An earlier iteration mirrored the whole rail + footer into the manifest (branch, lastCommit,
> localTime, madeIn, github contributions, tokensBurned, nowPlaying, reading, watching). It read as
> repetitive — those are all already on-screen — so it was trimmed back to the lean snapshot above,
> and the dedicated `/api/build-log.json` endpoint + `fetchBuildLog()` + `BuildLogPayload` it needed
> were removed (`BuildLog` now reuses the lean `/api/site-stats.json`).

## Removed (v1 cleanup)

- `src/pages/api/hits.json.ts` — deleted (custom counter endpoint).
- `src/components/widgets/SiteHits.tsx` — replaced by `SiteStats.tsx`.
- `incrementSiteHits()` / `fetchSiteHits()` / `HITS_ENDPOINT` in `src/lib/stats.ts`.
- The site-wide increment `<script>` in `src/layouts/BaseLayout.astro`.
- `SiteHits` type in `src/types/stats.ts`.
- `migration.sql` (the `site_counters` table). **DB note:** the `site_counters` table in Supabase
  is now unused and can be dropped manually (`drop table if exists site_counters;`) — optional,
  harmless if left.

## Files touched

| File | Change |
| --- | --- |
| `.docs/specs/2026-06-22--global-site-hits/*` | repurposed spec; `migration.sql` deleted |
| `src/lib/runtime.ts` | **add** Umami auth + `fetchUmamiTraffic`/`fetchGithubRepoStats`/`fetchTotalReactions`/`fetchSiteStats()` |
| `src/pages/api/site-stats.json.ts` | **new** — GET endpoint (umami + github repo + db); feeds both cards + build log |
| `src/types/integrations.ts` | **add** `SiteStatsPayload` |
| `src/lib/stats.ts` | swap hits helpers → `fetchSiteStats()` (TTL cache + dedup) |
| `src/components/widgets/SiteHits.tsx` | **new** island — all-time hits (fetch once) |
| `src/components/widgets/LiveVisitors.tsx` | **new** island — active visitors (polls 30s) |
| `src/components/widgets/BuildLog.tsx` | **new** island — lean `site.json` manifest (light, framed) |
| `src/pages/index.astro` | 3 stat cards + glob LOC/files + `<BuildLog>`; explore section removed |
| `src/components/studio/CodeToolbar.astro` | drop stale `CodeBlock.astro` mention |
| `src/layouts/BaseLayout.astro` | **remove** increment script |
| `src/types/stats.ts` | **remove** `SiteHits` type |
| **deleted** | `api/hits.json.ts`, old `SiteHits.tsx`/`SiteStats.tsx`, `studio/CodeBlock.astro`, `migration.sql` |

## Decisions

1. **Source** — ✅ Umami via public share token (no auth, no DB write). Custom counter dropped.
2. **"hits"** = all-time Umami pageviews; **online** = Umami active now.
3. **Live visitors** — own `live visitors` card (pulsing dot in the icon slot, plain number for
   alignment), not merged into hits.
4. **Card layout** — `posts` + `snippets` merged into one `notes` card → grid `notes | hits | live`.
5. **Build log** — repurposed from a fake static snippet into a real `site.json` manifest. Codebase
   `loc`/`files` via build-time glob (deploy-time facts); `commits`/`stars` via GitHub API +
   `reactions` via DB sum, all in the live endpoint. Light theme to match Expressive Code.
6. **Cache** — share token ~6h in-module; endpoint 30s shared; client reader 15s + in-flight dedup
   (one request shared across SiteHits / LiveVisitors / BuildLog).

## Out of scope

- Time-windowed analytics (today / week / month), trending posts, per-type breakdowns.
- Replacing Umami; this is a vanity display, not full analytics.
- Dropping the now-unused `site_counters` table (manual, optional).
