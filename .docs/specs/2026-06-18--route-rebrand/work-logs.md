# Work Logs

## 2026-06-18 — @hta218

Implemented the route rebrand on `v4`.

- Renamed pages (git mv): `about→whoami`, `blog→log`, `snippets→gists`,
  `projects→builds`, `tags→topics`. Slugs preserved.
- Merged `books.astro` + `movies.astro` → new `shelf.astro` with `#reading`
  and `#watching` sections (home explore cards deep-link to those anchors).
- Updated all internal links: `site.ts` nav (Log/Gists/Builds/whoami/Shelf/
  Topics), StudioShell explorer tree + tabs (labels, files, activeWhen), index
  cards + latest-post links, feeds, topic pages. Collection names (`blog`,
  `snippets`) and `data/` folders left unchanged — routes are decoupled.
- Added 301 redirects in `astro.config.mjs` and `vercel.json` (specific legacy
  `/snippets/crawling-goodreads-books-data` → `/log/...` ordered before the
  `/snippets/*` wildcard to avoid a loop).
- `bun run build` passes. Verified on dev: all new routes 200; every old route
  301s to its new path with slugs intact; sitemap has no old routes.

**Status:** implemented + verified locally. Ships with the v4 → www cutover.
