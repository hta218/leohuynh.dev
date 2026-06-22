# Plan: Global Site Hits Counter

## Goal

Replace the hardcoded `—` in the home page "views" card with a live, site-wide hit counter:

- One global number, incremented on **every** page load across the entire site.
- **Seeded** once from `SUM(views)` of the existing `stats` table (post + snippet views) so it
  doesn't start at 0.
- Same graceful-degradation philosophy as the existing stats widgets: if the DB / endpoint is
  unavailable (e.g. plain `astro preview`, missing `DATABASE_URL`), the card falls back to `—`
  and never fakes a number.

## Scope decision: what "global hits" means

`hits` = total page loads site-wide, an ever-growing counter. This is **different** from the
per-post `stats.views` rows:

- `stats.views` = views of a single blog/snippet (already tracked by `ViewsCounter.tsx`).
- `hits` = every visit to every page (home, /log, /gists, /builds, /shelf, post pages…).

We seed `hits` from `SUM(stats.views)` only to give it a sensible starting value, then it grows
independently on its own.

> Alternative considered: just display `SUM(stats.views)` as a read-only derived number (no new
> counter, no new tracking). Rejected because it only reflects blog/snippet traffic and wouldn't
> count the many non-article pages — and seeding would be meaningless. Kept as a fallback option
> if we decide we don't want a new write path.
>
> Alternative considered: read total pageviews from **Umami** (already wired via
> `PUBLIC_UMAMI_WEBSITE_ID`). Rejected as primary because it needs Umami API auth, can't be
> seeded from our own post views, and couples the home card to an external service. Noted as a
> possible future data source.

## Storage

Use the existing Supabase Postgres (`getSql()` from `src/lib/db.ts`). A single global counter.

**Primary approach — dedicated tiny table** (clean, no enum-constraint risk):

```sql
-- one-time migration, run in the Supabase SQL editor
create table if not exists site_counters (
  key   text primary key,
  value bigint not null default 0
);

-- seed the global hits counter from existing post + snippet views
insert into site_counters (key, value)
values ('hits', (select coalesce(sum(views), 0) from stats))
on conflict (key) do nothing;
```

`on conflict do nothing` makes the seed idempotent — re-running never overwrites a live count.

**Fallback approach (no DDL needed):** reuse the `stats` table with a sentinel row
(`type='site', slug='global'`) and store the count in `views`. Only viable if the `stats.type`
column is plain `text`/`varchar` (not a Postgres enum / CHECK limited to `blog|snippet`).
**Verification step before coding:** inspect the column type — query
`select data_type, udt_name from information_schema.columns where table_name='stats' and column_name='type'`.
If it's an enum/constrained, use the dedicated `site_counters` table (primary approach).

## API endpoint — `src/pages/api/hits.json.ts`

Follows the existing `api/stats.ts` conventions (`prerender = false`, `getSql()`, JSON helper,
try/catch → 503, graceful when `DATABASE_URL` missing).

- **GET `/api/hits.json`** → `{ ok: true, hits: <number> }`
  - Lazily seeds the `hits` row if absent (same seed query as the migration), so the feature
    works even if the manual migration wasn't run.
  - Read-only; cache-control short TTL (e.g. `s-maxage=30`) is fine since it's approximate.

- **POST `/api/hits.json`** → increments and returns the new value:
  ```sql
  insert into site_counters (key, value)
  values ('hits', (select coalesce(sum(views), 0) from stats) + 1)
  on conflict (key) do update set value = site_counters.value + 1
  returning value;
  ```
  The `insert … on conflict do update` means the very first hit also seeds correctly in one
  statement (no separate migration strictly required, but the migration is still recommended so
  the GET shows the seeded number before any POST happens).

Abuse / refresh-spam mitigation (keep simple): client throttles increments to once per ~30s per
session via `sessionStorage`; server stays dumb. Bot inflation is acceptable for a vanity
counter — we are not trying to match Umami's accuracy.

## Client increment — site-wide

The counter must increment on every page, so the trigger lives in `BaseLayout.astro` (wraps all
pages), not in a per-page island.

Add a small `is:inline` script (or a tiny client module) that fires once per page load:

- Fire on initial load **and** on `astro:page-load` (ClientRouter SPA navigations) so client-side
  route changes also count.
- `sessionStorage`-based throttle (skip if last increment < 30s ago) to avoid refresh spam.
- `fetch('/api/hits.json', { method: 'POST', keepalive: true })`, fire-and-forget, errors ignored.

## Display — home page card

`src/pages/index.astro` lines 67–73 currently:

```astro
<b class="block text-[28px]">—</b>
```

Replace with a React island (mirrors `ViewsCounter.tsx` pattern) — a new
`src/components/widgets/SiteHits.tsx`:

- On mount, `GET /api/hits.json`; show `hits.toLocaleString()`, or `—` while loading / on failure.
- Rendered with `client:idle` (or `client:visible`) in `index.astro`.
- The home page itself also triggers the BaseLayout increment, so the number is live.

A matching client fetch helper can go in `src/lib/stats.ts` (e.g. `fetchSiteHits()`,
`incrementSiteHits()`) to keep the graceful-fallback pattern in one place — optional, can also
inline in the component.

## Types

Add to `src/types/stats.ts`:

```ts
export interface SiteHits {
  hits: number
}
```

## Files touched

| File | Change |
| --- | --- |
| `.docs/specs/2026-06-22--global-site-hits/*` | this spec |
| **DB (Supabase, manual)** | new `site_counters` table + seed (SQL above) — run once |
| `src/pages/api/hits.json.ts` | **new** — GET (read+lazy-seed) / POST (increment) endpoint |
| `src/components/widgets/SiteHits.tsx` | **new** — React island that displays the count |
| `src/lib/stats.ts` | add `fetchSiteHits()` / `incrementSiteHits()` helpers (optional) |
| `src/types/stats.ts` | add `SiteHits` type |
| `src/layouts/BaseLayout.astro` | add site-wide increment script (initial load + `astro:page-load`) |
| `src/pages/index.astro` | replace hardcoded `—` with `<SiteHits client:idle />` |

## Decisions (confirmed 2026-06-22)

1. **Increment scope** — ✅ every page load site-wide (counter lives in `BaseLayout.astro`).
2. **Storage** — ✅ dedicated `site_counters` table (primary approach above). The `stats`
   sentinel-row fallback is dropped.
3. **Seed timing** — run the SQL migration manually in Supabase so GET shows the seeded value
   immediately; the endpoint also lazy-seeds as a safety net.

## Remaining open question

- **Seed timing detail** — to confirm at implementation: run migration before or after deploying
  the endpoint (either order is safe given idempotent seed).

## Out of scope

- Per-page or time-windowed analytics (today / week / month).
- Trending posts, per-type breakdowns.
- Replacing Umami; this is a vanity counter, not analytics.
