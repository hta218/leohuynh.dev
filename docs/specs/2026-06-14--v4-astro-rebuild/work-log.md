# Work Logs

## 2026-06-14 — @hta218 (Claude) — M0 + M1: plan, inventory, scaffold

### Scope of this run
First run of the v4 Astro rebuild. Goal: produce the plan + route inventory, then land the
first safe implementation milestone (scaffold + content schema). No commits — left for review.

### Guardrail compliance
- Stayed on branch `v4`. Did not touch `main`, `v3`, or `legacy-v3`.
- No legacy files modified — `git status` shows only new untracked paths
  (`docs/specs/.../plan.md`, `route-inventory.md`, `work-log.md`, `v4/`).
- No secrets committed. `v4/src/lib/site.ts` ports only non-secret metadata; analytics IDs/tokens
  stay in env. `v4/.gitignore` excludes `.env*`.

### What changed (created)
**Spec docs**
- `plan.md` — milestones M0–M5, tech decisions, file/folder scope, cutover note.
- `route-inventory.md` — legacy URL parity target (static, dynamic, feeds, API, redirects).
- `work-log.md` — this file.

**v4 Astro app (`v4/`)** — scaffolded in a subdirectory so the legacy Next.js app stays intact
as a migration reference. Cutover to repo root is a later milestone.
- `v4/package.json` (Bun scripts), `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `README.md`
- `v4/src/content.config.ts` — `blog` + `snippets` Content Collections. Zod schema mirrors
  legacy `contentlayer.config.ts`. **Content is not duplicated** — the glob loader reads the
  existing legacy MDX via `base: '../data/blog'` and `'../data/snippets'` (single source of truth).
- `v4/src/styles/global.css` — Tailwind v4 (`@import "tailwindcss"`) + design tokens from sketch 006.
- `v4/src/lib/site.ts` — non-secret site metadata + nav.
- `v4/src/layouts/BaseLayout.astro` — html head, canonical, OG/Twitter meta.
- `v4/src/components/studio/StudioShell.astro` — Fullscreen Code Studio shell (titlebar /
  explorer sidebar / main / runtime rail / status bar), responsive collapse < lg.
- `v4/src/components/studio/RuntimeRail.astro` — static Spotify / GitHub-today / activity
  placeholders (real integrations = M4).
- `v4/src/pages/index.astro` — homepage hero + live stat counts + latest 3 posts from collection.
- `v4/src/pages/blog/index.astro` — full post index from collection.
- `v4/src/pages/snippets/index.astro` — snippet grid from collection.

### Verification (real output)
- `bun install` → 400 packages, resolved clean. Astro 5.18.2, Tailwind 4.3.1, React 19.2.7,
  @astrojs/mdx 4.3.14, @astrojs/react 4.4.2, @astrojs/rss 4.0.18, @astrojs/sitemap 3.7.3.
- `bun run build` → **success**, 3 pages + sitemap in ~2.3s. Output in `v4/dist/`:
  `index.html`, `blog/index.html`, `snippets/index.html`, `sitemap-index.xml`, `sitemap-0.xml`.
- Schema validated against **real** legacy content: homepage shows **28** posts and **25**
  snippets; blog index lists "28 posts". 25/26 snippets because `useful-array-utilities.mdx`
  is `draft: true` (filtered, matching legacy production behavior). No Zod schema errors —
  all 28+26 frontmatter blocks parsed against the migrated schema.
- The glob loader compiled the legacy MDX bodies during build (Shiki emitted benign
  "language doesn't exist" warnings for code-fence `lang:filename` annotations in real posts) —
  confirms the content pipeline reaches the actual MDX, not just stubs.

### Notes / decisions
- Article *body* rendering (full MDX with `<Twemoji>` etc., Expressive Code, `/static` images)
  is intentionally deferred to M3. Only `<Twemoji>` is used as real inline JSX in prose (190× in
  blog, 22× in snippets); the other capitalized tags live inside code fences. Body compilation
  already succeeds; rendering just needs the component mapping + image assets, wired next.
- Shiki warnings are cosmetic (code-fence titles like ```bash:.env``` parsed as a language). Will
  switch to `astro-expressive-code` with proper title handling when wiring article pages.

### Known gaps (next milestones)
- M2: `/blog/[slug]`, `/blog/page/[page]`, `/snippets/[slug]`, `/tags`, `/tags/[tag]`,
  `/feed.xml` (+ per-tag), robots, 404, the `crawling-goodreads-books-data` redirect, OG images.
- M3: production design components + full content rendering + remaining pages
  (projects/about/books/movies).
- M4: Spotify / GitHub-today / activity islands, Umami, stats/reactions decision.
- Then diff `v4/dist` routes against `route-inventory.md` before any cutover.

### Hermes verification addendum
- `bun run build` reproduced successfully after Claude's run.
- `bun run check` initially prompted for missing `@astrojs/check`; added `@astrojs/check` + `typescript` as dev dependencies with `bun add -d @astrojs/check typescript`.
- `bun run check` then passed: 0 errors, 0 warnings, 0 hints.
- `bun run build` passed again after dependency update: 3 static pages built.
- Previewed locally at `http://127.0.0.1:4322`; browser console had 0 JS errors. Desktop visual QA shows the 006-style full-screen code studio layout with no obvious clipping/overlap.

### For the reviewer (Hermes)
- Inspect `v4/`. Reproduce with: `cd v4 && bun install && bun run check && bun run build`.
- Nothing committed. No legacy code touched. Branch `v4`.

## 2026-06-14 — @hta218 (Claude) — M2: URL & SEO parity

### Scope of this run
Implement M2 in the controlled `v4/` subdirectory: blog/snippet detail routes, blog
pagination, tags index + tag pages, main + per-tag RSS, sitemap/robots/404, the goodreads
301 redirect, and canonical/OG/Twitter parity. No commits.

### Guardrail compliance
- Stayed on branch `v4`. No changes to `main`, `v3`, `legacy-v3`, or any legacy file
  (`app/**`, `data/**`, etc. read-only references only).
- No secrets touched. `v4/src/lib/site.ts` only adds the non-secret `socialBanner` path + `POSTS_PER_PAGE`.
- Content still single-sourced from legacy `../data/**` via the glob loader (no duplication).

### What changed (created)
- `v4/src/lib/content.ts` — shared helpers: `isPublished`, `getPublishedBlog/Snippets`,
  `tagSlug` (github-slugger), `getTagCounts`, `getContentByTag`. Centralizes draft filter +
  slug parity for list/detail/tag/RSS routes.
- `v4/src/components/mdx/Twemoji.astro` — minimal `<Twemoji>` placeholder so legacy MDX
  prose (212 inline uses) renders without crashing. Full twemoji assets = M3.
- `v4/src/components/PostList.astro` — shared post list + pager (page 1 → `/blog`, 2..N → `/blog/page/N`).
- `v4/src/pages/blog/[...slug].astro` — 28 blog detail pages, slug = filename, full MDX body render.
- `v4/src/pages/snippets/[...slug].astro` — 25 snippet detail pages (1 draft excluded).
- `v4/src/pages/blog/page/[page].astro` — pages 1–4 (POSTS_PER_PAGE=9), legacy parity.
- `v4/src/pages/tags/index.astro` — all tags sorted by count.
- `v4/src/pages/tags/[tag].astro` — 170 tag pages, posts + snippets, per-tag RSS `<link>` in head.
- `v4/src/pages/feed.xml.ts` — main RSS (blog+snippets, newest first).
- `v4/src/pages/tags/[tag]/feed.xml.ts` — 170 per-tag feeds.
- `v4/src/pages/404.astro` — terminal-styled 404.
- `v4/public/robots.txt` — points at `/sitemap-index.xml`.
- `v4/vercel.json` — Vercel-level permanent redirect for the Goodreads legacy snippet URL.

### What changed (modified)
- `v4/astro.config.mjs` — `trailingSlash: 'never'` (canonical/sitemap parity) + `redirects`
  for the goodreads 301.
- `v4/src/layouts/BaseLayout.astro` — full OG/Twitter/canonical parity, `ogType`/`ogImage`/
  `canonicalUrl`/`publishedTime` props, RSS `<link>`, `<slot name="head" />`.
- `v4/src/styles/global.css` — minimal `.prose` article styles (M3 polishes typography).
- `v4/src/pages/blog/index.astro` — now paginated (page 1) via `PostList`.
- `v4/src/lib/site.ts` — added `socialBanner`, `POSTS_PER_PAGE`.
- `v4/package.json` — added `github-slugger` as a direct dependency.

### Verification (real output)
- `bun run check` → **0 errors, 0 warnings, 0 hints** (21 files).
- `bun run build` → **success, 232 page(s) built in ~2.5s**; 233 HTML files in `dist`.
  - 28 `/blog/<slug>`, 4 `/blog/page/<n>`, 25 `/snippets/<slug>` (+ goodreads redirect dir),
    170 `/tags/<tag>`, 170 `/tags/<tag>/feed.xml`, plus `/`, `/blog`, `/snippets`, `/tags`.
  - SEO endpoints present: `feed.xml`, `robots.txt`, `sitemap-index.xml`, `sitemap-0.xml`, `404.html`.
  - Redirect page emitted at `dist/snippets/crawling-goodreads-books-data/index.html`
    (static fallback + canonical to `/blog/crawling-goodreads-books-data`). Local Astro preview serves it as `200`; `v4/vercel.json` provides the real Vercel 301 at cutover.
  - Draft snippet `useful-array-utilities` correctly excluded from `dist`.
  - Canonical + sitemap URLs have **no trailing slash** (legacy parity); RSS item links resolve
    to real collection URLs (`/snippets/<slug>` for snippets), fixing a legacy `/blog/`-only quirk.

### Known gaps (next milestones)
- M3: `/static/*` assets (post images currently 404), Expressive Code, real twemoji,
  `/projects` `/about` `/books` `/movies`, design polish.
- Search `/search.json` (Pagefind/deferred). API routes + Umami + `vercel.json` rewrites = M4/cutover.
- Add a `/sitemap.xml` alias at cutover only if an external service hardcodes the legacy path.
