# P2.2 implementation notes

Date: 2026-07-10
Branch: `perf/client-navigation-spec`

## Scope implemented

P2.2 only — reduce `/shelf` initial document payload while keeping the visible page useful without interaction.

- Server-rendered only the SEO/useful first slice:
  - all currently-reading books,
  - first 5 read books,
  - first 3 movies per rating group.
- Added `GET /api/shelf.json` as the full data source for client expansion.
- Reworked the existing show-more behavior so it fetches `/api/shelf.json` once, appends the remaining books/movies client-side, then removes the clicked button.
- Kept the same external links and visible card structure for the initial slice.

## Files changed

- `src/pages/shelf.astro`
  - limits initial book/movie lists,
  - adds client-side show-more expansion from `/api/shelf.json`.
- `src/pages/api/shelf.json.ts`
  - returns sorted full books and movies data.

## Verification performed

- `bun run check` — passed, 0 errors / 0 warnings / 0 hints.
- `bun run build` — passed.
- Built `/shelf` HTML size:
  - before this slice: `304,574` bytes,
  - after this slice: `198,613` bytes.
- Built `/api/shelf.json` size: `149,477` bytes.
- Browser smoke on local dev server:
  - `/shelf` renders currently-reading and initial read/watching slices,
  - read books show-more expands from 5 to 22 items via `/api/shelf.json`,
  - first movie group show-more appends remaining items via the same cached API request,
  - browser console was clean.

## Notes

Astro dev server HTML includes dev/runtime overhead, so payload-size acceptance was measured from the production build output at `dist/client/shelf/index.html`.

The endpoint is intentionally a static/full-data expansion source for this page, matching the previous build-time freshness model of `/shelf`. If live shelf freshness becomes important later, convert it to `prerender = false` with an explicit cache policy.
