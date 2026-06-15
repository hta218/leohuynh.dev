# Route inventory — legacy (current) site

Generated 2026-06-14 from the Next.js app on branch `v4`. This is the **parity target**:
every URL below must keep working (or be intentionally redirected) before v4 promotes to `main`.

Counts at inspection: **28** blog posts (`data/blog/*.mdx`), **26** snippets (`data/snippets/*.mdx`).
No nested content subdirectories — slug = filename without `.mdx`, so URL = `/blog/<filename>` and `/snippets/<filename>`.

## Static pages

| URL          | Source                        | Notes                                  |
| ------------ | ----------------------------- | -------------------------------------- |
| `/`          | `app/page.tsx`                | Homepage (→ 006 studio in v4)          |
| `/blog`      | `app/blog/page.tsx`           | Blog list, page 1, 9 per page          |
| `/snippets`  | `app/snippets/page.tsx`       | Snippet list                           |
| `/projects`  | `app/projects/page.tsx`       | From `data/projects.ts`                |
| `/about`     | `app/about/page.tsx`          | Author/about                           |
| `/books`     | `app/books/page.tsx`          | Goodreads-derived                      |
| `/movies`    | `app/movies/page.tsx`         | IMDb-derived                           |
| `/tags`      | `app/tags/page.tsx`           | All tags                               |
| `/guestbook` | —                             | **Dropped / not in scope** — production `/guestbook` is 404; no guestbook code to migrate |

## Dynamic pages

| URL pattern            | Source                              | Notes                                       |
| ---------------------- | ----------------------------------- | ------------------------------------------- |
| `/blog/[...slug]`      | `app/blog/[...slug]/page.tsx`       | 28 posts; slug = filename                   |
| `/blog/page/[page]`    | `app/blog/page/[page]/page.tsx`     | Pagination, `POSTS_PER_PAGE = 9`            |
| `/snippets/[...slug]`  | `app/snippets/[...slug]/page.tsx`   | 26 snippets; slug = filename                |
| `/tags/[tag]`          | `app/tags/[tag]/page.tsx`           | Tag pages from `json/tag-data.json`         |

### Evergreen / high-value URLs (protect explicitly)
- `/blog/does-promise-all-run-in-parallel-or-sequential` — primary organic-traffic post.
- `/blog/tailwindcss-arbitrary-value-support` (Tailwind arbitrary values) — high search intent.
- `/blog/migrate-from-namecheap-private-email-to-zoho-mail`-style ops guides — strong search intent.

(Confirm exact evergreen slugs against `data/blog/` during M2 — the full 28 slugs are the parity set.)

## Feeds / data / SEO endpoints

| URL                        | Source                         | Notes                                      |
| -------------------------- | ------------------------------ | ------------------------------------------ |
| `/feed.xml`                | `scripts/rss.ts`               | Main RSS                                   |
| `/tags/[tag]/feed.xml`     | `scripts/rss.ts`               | Per-tag RSS (one per tag)                  |
| `/search.json`             | `contentlayer.config.ts`       | kbar local search index                    |
| `/sitemap.xml`             | Next sitemap                   | Verify in v4                               |
| `/robots.txt`              | static/public                  | Verify in v4                               |
| `/static/*`                | `public/static/`               | Images, resume.pdf, etc.                   |

## API routes (server)

| URL                       | Source                              | v4 plan                                       |
| ------------------------- | ----------------------------------- | --------------------------------------------- |
| `/api/spotify`            | `app/api/spotify/route.ts`          | Port for now-playing island                   |
| `/api/github`             | `app/api/github/route.ts`           | Port for GitHub-today widget                  |
| `/api/activities`         | `app/api/activities/route.ts`       | Port for activity timeline                    |
| `/api/stats`              | `app/api/stats/route.ts`            | **Retained** — views/reactions. v4 ships `api/stats.ts` Vercel Function preserving the legacy GET/POST contract |
| `/api/newsletter`         | `app/api/newsletter/route.ts`       | Buttondown newsletter                         |
| `/api/guestbook`, `/api/guestbook/[id]` | —                     | **Dropped / not in scope** — no guestbook in production |
| `/api/auth/[...nextauth]` | —                                   | **Dropped** — was only for guestbook/auth      |

## Known redirects to preserve

| From                                          | To                                          | Type      |
| --------------------------------------------- | ------------------------------------------- | --------- |
| `/snippets/crawling-goodreads-books-data`     | `/blog/crawling-goodreads-books-data`       | permanent (301) |

Source: `next.config.js` `redirects()`.

## Other behavior to preserve
- `vercel.json` rewrite: `/stats/:match*` → `https://analytics.leohuynh.dev/:match*` (Umami proxy).
- Security headers from `next.config.js` `headers()` (re-evaluate equivalents in v4 hosting).

## v4 build route inventory — M2 (generated 2026-06-14)

Source: `cd v4 && bun run build` → `v4/dist`. **233 HTML pages** + feeds/sitemap/robots.
`trailingSlash: 'never'` so canonical/sitemap URLs match the legacy Next.js (no trailing slash).

### Static pages

| URL         | v4 source                        | Status |
| ----------- | -------------------------------- | ------ |
| `/`         | `src/pages/index.astro`          | ✅ built (M1) |
| `/blog`     | `src/pages/blog/index.astro`     | ✅ page 1, 9/page, pager |
| `/snippets` | `src/pages/snippets/index.astro` | ✅ built (M1) |
| `/tags`     | `src/pages/tags/index.astro`     | ✅ all tags + counts |
| `/404`      | `src/pages/404.astro`            | ✅ `dist/404.html` |
| `/about`    | `src/pages/about.astro`          | ✅ M3 — career timeline, resume, socials |
| `/projects` | `src/pages/projects.astro`       | ✅ M3 — 16 projects from `lib/projects.ts` |
| `/books`    | `src/pages/books.astro`          | ✅ M3 — 25 books from cached `json/books.json` |
| `/movies`   | `src/pages/movies.astro`         | ✅ M3 — 98 titles from cached `json/movies.json` |
| `/guestbook`| —                                | ⛔ **dropped / not in scope** (production `/guestbook` is 404; nothing to migrate) |

### Dynamic pages

| URL pattern         | v4 source                          | Count | Status |
| ------------------- | ---------------------------------- | ----- | ------ |
| `/blog/<slug>`      | `src/pages/blog/[...slug].astro`   | 28    | ✅ slug parity, full MDX body renders |
| `/blog/page/<n>`    | `src/pages/blog/page/[page].astro` | 4     | ✅ pages 1–4 (POSTS_PER_PAGE=9) |
| `/snippets/<slug>`  | `src/pages/snippets/[...slug].astro` | 25  | ✅ slug parity (1 draft excluded) |
| `/tags/<tag>`       | `src/pages/tags/[tag].astro`       | 170   | ✅ slug parity (`github-slugger`) |

### Feeds / data / SEO endpoints

| URL                    | v4 source                          | Status |
| ---------------------- | ---------------------------------- | ------ |
| `/feed.xml`            | `src/pages/feed.xml.ts`            | ✅ blog+snippets, newest first |
| `/tags/<tag>/feed.xml` | `src/pages/tags/[tag]/feed.xml.ts` | ✅ 170 per-tag feeds |
| `/sitemap-index.xml` + `/sitemap-0.xml` | `@astrojs/sitemap`    | ✅ (legacy used `/sitemap.xml`) |
| `/robots.txt`          | `public/robots.txt`                | ✅ points at `/sitemap-index.xml` |
| `/search.json`         | —                                  | ⛔ **gap → search milestone** (Pagefind/deferred) |
| `/static/*`            | `public/static` → symlink to legacy `../public/static` (M3) | ✅ images/resume/favicons emitted to `dist/static/**`; git-ignored, not duplicated |

### Redirects

| From                                      | To                                    | v4 impl | Status |
| ----------------------------------------- | ------------------------------------- | ------- | ------ |
| `/snippets/crawling-goodreads-books-data` | `/blog/crawling-goodreads-books-data` | `astro.config.mjs` static redirect fallback + `v4/vercel.json` 301 for Vercel | ✅ built locally; real HTTP 301 depends on Vercel config at cutover |

### M2 diff vs legacy parity target

**Matched:** all blog/snippet slugs, `/blog/page/[n]` pagination, `/tags` + `/tags/[tag]`,
main + per-tag RSS, robots, 404, the goodreads 301, canonical/OG/Twitter from frontmatter.

**Intentional deltas:**
- RSS item links go to the item's real collection URL (`/snippets/<slug>` for snippets).
  Legacy linked **every** item under `/blog/<slug>` (a legacy bug → broken snippet links). Fixed in v4.
- Sitemap is `sitemap-index.xml` (+ `sitemap-0.xml`) vs legacy `/sitemap.xml`. Add a
  `/sitemap.xml` alias at cutover if any external service hardcodes the old path.

**Known gaps (later milestones):**
- `/search.json` local search index (search milestone).
- API routes (`/api/*`) — M4 integrations.
- `vercel.json` Umami `/stats/:match*` rewrite + security headers — cutover/hosting milestone.

### M3 update (2026-06-14)
- **Closed:** `/about`, `/projects`, `/books`, `/movies` now built (236 total pages, was 232).
  `/static/*` assets resolve via git-ignored symlink (no 21MB duplication). Legacy `lang:title`
  code fences + Twemoji render cleanly (Expressive Code title tabs; real Unicode emoji glyphs);
  **0 Shiki warnings** at build.
- **Still open:** Books/movies use the cached `json/*.json` snapshots (static); swap to live Drizzle
  at cutover if fresh data is wanted.

### M4 update (2026-06-15) — views + reactions retained
- **Retained & shipped:** blog + snippet detail pages now render a `ViewsCounter` and a four-reaction
  `Reactions` bar (loves / applauses / bullseyes / ideas, 10-per-slug localStorage cap), ported from
  the legacy Next.js components.
- **Persistence:** v4 ships `api/stats.ts`, a Vercel Function that preserves the legacy `/api/stats`
  GET/POST contract against the existing `stats` table when `DATABASE_URL` is configured. The client
  compat layer (`v4/src/lib/stats.ts`) degrades gracefully in plain `astro preview`, where Vercel
  Functions are not served.
- **Guestbook:** dropped / not in scope — production `/guestbook` is 404 and no guestbook code exists.
