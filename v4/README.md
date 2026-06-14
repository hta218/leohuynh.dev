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

No secrets are required for static content pages, RSS, sitemap, `/books`, `/movies`, or `/search.json`.
