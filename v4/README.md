# leohuynh.dev v4

Astro + Bun rebuild of leohuynh.dev, kept in `v4/` during migration so the legacy Next.js app remains available as the content/reference source.

## Commands

```bash
bun install
bun run dev
bun run check
bun run build
bun run preview
```

## Integrations

The runtime rail currently fetches static JSON generated during `bun run build` and degrades cleanly when credentials are missing. For local/prod build-time data, copy `.env.example` to `.env` and set:

- `PUBLIC_UMAMI_WEBSITE_ID` or legacy `NEXT_UMAMI_ID`
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`
- `GITHUB_API_TOKEN`
- `DATABASE_URL` for persisted article/snippet views + reactions via `api/stats.ts`

No secrets are required for static content pages, RSS, sitemap, `/books`, `/movies`, or `/search.json`.

## Views & reactions

Blog and snippet detail pages render a view counter and a four-reaction bar (loves / applauses /
bullseyes / ideas, capped at 10 per slug per browser via localStorage). These are client React islands
that call the legacy `/api/stats` contract through a graceful-fallback layer (`src/lib/stats.ts`):

- When `/api/stats` is **unavailable** (for example plain `astro preview` without Vercel Functions),
  the UI still renders — `–– views`, `--` reaction counts plus the visitor's own optimistic `+N`.
  Writes that can't reach an endpoint are dropped, never shown as persisted.
- When deployed on **Vercel with `DATABASE_URL`**, `api/stats.ts` provides the legacy-compatible
  GET/POST contract and persists counts in the existing `stats` table.

`astro preview` serves only Astro's static output, so use Vercel/deploy preview to exercise persisted
`/api/stats` behavior end-to-end.
