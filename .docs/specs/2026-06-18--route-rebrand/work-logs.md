# Work Logs

## 2026-07-08 — blog URL canonical rollback

Decision after SEO review: restore blog content URLs to the legacy `/blog` prefix,
while keeping the visible dev-flavored section label as `logs` / `Log` where it
fits the Studio shell vibe.

- Wrote implementation handoff:
  `handoff--2026-07-08--restore-blog-url-canonical.md`.
- Required canonical routes: `/blog`, `/blog/:slug`, `/blog/page/:page` (page 2+).
- Required redirects: `/log*` → `/blog*`; `/blog/page/1` → `/blog`.
- Required SEO cleanup: sitemap, canonicals, OG URLs, JSON-LD, RSS, search JSON,
  nav links, topic links, and home latest-post links all use `/blog*`.
- Preserve sidebar folder label `logs` / `Logs` if desired; only public URL pattern
  changes.
- Delegated implementation to Claude Code from the handoff. Claude exited with
  `Reached max turns (30)` but left a complete useful diff; Hermes inspected and
  finished minor crumb/comment cleanup.
- Verification completed by Hermes:
  - `bun run check` — passed, `0 errors`, `0 warnings`, `0 hints`.
  - `bun run build` — passed; generated `/blog/*` pages and redirect-only `/log*`
    entries with empty response bodies.
  - Static output checks — `/blog` index/detail exist; `/log` detail file absent;
    representative canonical and OG URLs use `/blog`; sitemap/RSS/search JSON use
    `/blog` and not `/log` for blog entries.
  - Astro dev smoke — `/blog`, `/blog/:slug`, `/blog/page/2` return `200`;
    `/log`, `/log/:slug`, `/log/page/2`, `/blog/page/1` return `301` to the
    expected `/blog` destination.
  - Browser spot check — representative post renders at `/blog/:slug`, canonical
    and JSON-LD point to `/blog`, and console has no errors.
- Autoreview Copilot was attempted but failed on Copilot NDJSON parse noise; manual
  fallback used plus an independent no-edit review agent. No blockers found.

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
