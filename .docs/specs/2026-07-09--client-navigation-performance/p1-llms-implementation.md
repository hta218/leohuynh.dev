# P1.3 implementation notes

Date: 2026-07-10
Branch: `perf/client-navigation-spec`

## Scope implemented

P1.3 only — make `/llms` route navigation independent from the private GitHub token-burn summary fetch.

- Converted `/llms` back to a prerendered/static document.
- Replaced server-rendered telemetry with first-paint placeholders.
- Hydrates the full LLM token-burn view client-side after page load via `GET /api/token-burn.json?view=full`.
- Reused the existing `/api/token-burn.json` endpoint for both compact rail data and full page data.
- Kept the private `TOKEN_BURN_SUMMARY_URL` and `GITHUB_API_TOKEN` server-only inside the API route/lib path.

## Files changed

- `src/pages/llms.astro`
  - no longer imports or awaits `fetchTokenBurnFull()` during page render,
  - renders the static page shell/placeholders,
  - imports the client hydrator.
- `src/pages/api/token-burn.json.ts`
  - supports `?view=full` for the richer page payload,
  - keeps the existing compact response as the default for the runtime rail.
- `src/components/studio/llms/client/hydrate.ts`
  - fetches full token-burn data after `astro:page-load`,
  - populates hero totals, recent windows, daily chart, model rows, and provenance.

## Verification performed

- `bun run check` — passed, 0 errors / 0 warnings / 0 hints.
- `bun run build` — passed.
- Built `/llms` HTML size: `166,928` bytes.
- Production build output now prerenders `/llms/index.html`; the page document no longer depends on the private GitHub summary request.
- Local API smoke:
  - `/api/token-burn.json` returned the existing compact payload.
  - `/api/token-burn.json?view=full` returned full page data with `daily` and `allTimeModels` arrays.
- Browser smoke on local dev server:
  - direct `/llms` load hydrates all-time total, daily chart, model breakdown, and provenance,
  - client navigation from `/` to `/llms` hydrates the same data,
  - browser console was clean.

## Notes

This keeps the route visually useful immediately but shifts the private telemetry fetch to post-swap client hydration. The API response is still CDN-cacheable via the existing `jsonHeaders(600)` policy, and no private source URL or token is exposed to the browser.
