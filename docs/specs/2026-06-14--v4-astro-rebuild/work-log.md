# Work Logs

## 2026-06-15 — Hermes — M5 verification prep + hosting parity

### Scope of this run
Continue v4 verification toward cutover without promoting production. Focused on route parity, preview smoke,
visual QA, and Vercel hosting config that can be safely committed before a deploy preview.

### What changed
- Root `vercel.json` now sets `framework: astro` and forces the GitHub/Vercel project to install/build/output
  the `v4/` Astro app
  (`cd v4 && bun install --frozen-lockfile`, `cd v4 && bun run build`, output `v4/dist`) because the
  current Vercel project was still trying to build the legacy root Next app.
- Root `api/stats.ts` is a small shim to `v4/api/stats.ts` so `/api/stats` can still deploy if the
  Vercel project root remains the repository root. If the project Root Directory is later set to `v4`,
  this shim is ignored.
- `v4/vercel.json` mirrors the same hosting routes for a future clean Root Directory = `v4` setup.
- Vercel config carries the legacy Umami `/stats/:match*` rewrite and security headers from
  legacy `next.config.js`.
- Added Vercel 301 compat redirects:
  - `/snippets/snippets/:slug*` → `/snippets/:slug*` because production sitemap currently exposes
    broken `/snippets/snippets/*` URLs.
  - `/sitemap.xml` → `/sitemap-index.xml` for legacy sitemap URL compatibility.
- `route-inventory.md` updated to reflect `/search.json`, redirect compat, and M5-resolved hosting gaps.
- `plan.md` M5 checklist updated: build/check, route inventory, and screenshots are green; deploy preview
  remains pending approval/project linking.

### Verification (real output)
- `bun run check` → **0 errors, 0 warnings, 0 hints**.
- `bun run build` → **success, 236 page(s) built**.
- Production sitemap vs v4 build diff: **61 prod URLs**, **25 redirected production sitemap-bug URLs**, **0 uncovered missing URLs**.
- Preview HTTP smoke on port 4326: `200` for `/`, `/blog`, representative blog/snippet, `/projects`,
  `/about`, `/books`, `/movies`, `/tags`, `/feed.xml`, `/search.json`, static JSON APIs, and `/static/resume.pdf`.
- Browser QA: homepage + representative article console had **0 JS errors**; desktop visual had no obvious
  layout issues; mobile screenshots for homepage/article had no obvious blocking layout issues.

### Blocker / next step
- GitHub/Vercel preview for commit `822493a` failed because the project was still building the legacy
  repository root. This run adds root `vercel.json` build settings to target `v4`; the next pushed commit
  should trigger a fresh preview build.
- `vercel build` cannot inspect/build the Vercel deployment locally because this checkout has no Vercel
  credentials/project settings: `No Project Settings found locally` / `No existing credentials found`.
- Next step after push is to watch the new GitHub/Vercel status and smoke-test the preview URL. Do not
  promote production without approval.

## 2026-06-15 — Claude + Hermes — M4 follow-up: persisted views + reactions

### Scope of this run
Implement views + reactions for v4, keep their legacy `/api/stats` persistence contract, and settle
the open retain/drop decisions: **views + reactions retained**, **guestbook dropped / not in scope**
(production `/guestbook` is 404, no guestbook code to migrate). Claude implemented the client UI;
Hermes added the Vercel Function persistence layer and verified.

### Guardrail compliance
- Stayed on branch `v4`; edited only `v4/**` plus this spec folder. No legacy source modified
  (legacy `app/**`, `components/**`, `db/**`, `hooks/**` read as reference only).
- Did not read or print `.env` values. No secrets touched. **Did not** re-add `@astrojs/vercel` or
  force an adapter upgrade. Astro build stays static.
- `DATABASE_URL` is documented as a required production/Vercel env var for persisted stats; only the
  key name is committed.

### What changed (created)
- `v4/src/types/stats.ts` — `StatsType`, `ReactionKey`, `BlogStats` (mirrors legacy `statsTable`).
- `v4/src/lib/stats.ts` — client compat layer for the legacy `/api/stats` contract. `fetchStats`
  returns `null` on 404/unavailable; `postStats` returns `false` unless a real persisted success. No
  throwing, no fake success.
- `v4/src/components/widgets/ViewsCounter.tsx` — React island; reads stats, increments once per load
  only when the endpoint answers, else renders `–– views`. Ported from `components/blog/views-counter.tsx`.
- `v4/src/components/widgets/Reactions.tsx` — React island; four reactions (loves/applauses/bullseyes/
  ideas) using `lib/emoji` Unicode glyphs, 10-per-slug localStorage cap, debounced save, local
  optimistic `+N`. Renders `--` + local counts when API is unavailable. Ported from `components/blog/reactions.tsx`.
- `v4/api/stats.ts` — Vercel Function that preserves the legacy `/api/stats` GET/POST contract,
  creates missing `stats` rows, and persists monotonic views/reaction updates to the existing `stats`
  table using `DATABASE_URL`.

### What changed (modified)
- `v4/src/pages/blog/[...slug].astro` — `ViewsCounter` in the header meta row (`client:load`),
  `Reactions` in a `not-prose` block after the article (`client:visible`).
- `v4/src/pages/snippets/[...slug].astro` — same wiring for snippets.
- `v4/package.json` / `bun.lock` — added `postgres` for the Vercel Function.
- `v4/.env.example` / `v4/README.md` — added/documented `DATABASE_URL` for persisted stats.
- Spec docs: `plan.md` (M3/M4 decisions), `route-inventory.md` (stats retained, guestbook/auth dropped).

### Runtime note
`astro preview` serves Astro's static output only, so it does not execute `v4/api/stats.ts`. In plain
preview the widgets intentionally fall back (`–– views`, `--` reactions + local optimistic counts).
On Vercel, `api/stats.ts` should be deployed as a serverless function alongside the static Astro output
and persist counts when `DATABASE_URL` is configured.

### Verification (real output)
- `bun run check` → **0 errors, 0 warnings, 0 hints** (44 files after adding `api/stats.ts`).
- `bun run build` → **success, 236 page(s) built** (unchanged count — islands on existing routes).
- `astro preview` smoke test: `/blog/does-promise-all-run-in-parallel-or-sequential` and
  `/snippets/using-spotify-api-to-display-currently-playing-track` both `200`, each with ViewsCounter +
  Reactions islands. `/api/stats?...` is not served by `astro preview`, exercising the graceful-fallback path.

### Known gaps / next decisions
- Persisted stats need Vercel/deploy-preview verification because Astro preview does not run Vercel Functions.

## 2026-06-14 — Hermes — M4: runtime rail integrations, analytics, search JSON

### Scope of this run
Implemented M4 as a static-safe integration layer for the v4 Astro app: React rail widgets, static JSON endpoints, Umami script support, analytics nav link, env docs, and `/search.json`. Claude Code was attempted first but was rate-limited until 2:30am Asia/Saigon, so Hermes implemented and verified directly.

### Guardrail compliance
- Stayed on branch `v4` and edited only `v4/**` plus this spec folder.
- Did not read or commit secret values. Added `v4/.env.example` with key names only.
- Kept output static. Attempted `@astrojs/vercel@10` for request-time endpoints, but it requires Astro 6 and failed against Astro 5.18.2 (`Missing "./app/entrypoint" specifier in "astro" package`). Removed the adapter and kept M4 build-time JSON fallback instead.

### What changed
- `v4/src/components/studio/RuntimeRail.astro` now mounts React islands:
  - `SpotifyWidget.tsx`
  - `GithubTodayWidget.tsx`
  - `ActivityWidget.tsx`
- `v4/src/lib/runtime.ts` centralizes safe integration fetchers:
  - Spotify current/recent track from Spotify refresh-token flow, with unavailable fallback.
  - GitHub today summary from GraphQL, with contribs/commits/top repo and optional line stats.
  - Recent activity from cached books/movies plus optional Spotify/GitHub.
- Static JSON routes generated at build:
  - `/api/spotify.json`
  - `/api/github-today.json`
  - `/api/activity.json`
  - `/search.json`
- `BaseLayout.astro` adds Umami script when `PUBLIC_UMAMI_WEBSITE_ID` or legacy `NEXT_UMAMI_ID` is available.
- `site.ts` adds the legacy Umami share URL and Analytics nav link.
- `StudioShell.astro` makes external links open with `target="_blank"` and displays friendly route labels.
- `v4/.env.example` + `v4/README.md` document integration env keys.

### Verification (real output)
- `bun run check` → **0 errors, 0 warnings, 0 hints** (39 files).
- `bun run build` → **success, 236 page(s) built in ~4.06s**.
- Local preview smoke test on `http://127.0.0.1:4324` returned `200` for `/`, `/search.json`, `/api/activity.json`, `/api/spotify.json`, `/api/github-today.json`, and `/static/resume.pdf`.
- Browser console on homepage: **0 JS errors**.
- Visual QA: runtime rail widgets fit, no obvious overlap/clipping; fallback states render cleanly.

### Known gaps / next decisions
- JSON integration routes are build-time/static for now, not live per request. Request-time APIs should wait for compatible Astro/Vercel adapter or an Astro upgrade.
- Current local build did not load root `.env`, so Spotify/GitHub JSON intentionally rendered unavailable states; production/build env can populate them.
- Views/reactions/guestbook/auth decision was still open at this point; resolved in 2026-06-15 M4 follow-up
  (views/reactions retained, guestbook/auth dropped).

## 2026-06-14 — @hta218 (Claude) — M3: design polish, static assets, remaining pages

### Scope of this run
Implement M3 in the controlled `v4/` subdirectory: make legacy `/static/*` assets available
without duplicating them into git, polish article/content rendering (Expressive Code + legacy
`lang:title` fences + real Twemoji glyphs), build the remaining static pages
(`/about`, `/projects`, `/books`, `/movies`), and push the homepage/shell closer to sketch 006
with reasonable mobile behavior. Guestbook intentionally **not** built; later confirmed dropped because production
`/guestbook` is 404.
No commits — left for Hermes.

### Guardrail compliance
- Stayed on branch `v4`. No changes to `main`, `v3`, `legacy-v3`, or any legacy source file. `git status`
  shows only spec-doc updates plus modified/untracked paths under `v4/` (legacy `data/**`, `app/**`, `css/**`, `json/**`
  read-only references only).
- No secrets touched. Books/movies render from the **cached** `json/*.json` snapshots at build
  time — no Supabase/DB access, no tokens. `v4/src/lib/site.ts` only adds non-secret public URLs.
- Single-sourced assets: `v4/public/static` is a git-ignored symlink to legacy `../public/static`
  (21MB not duplicated into git).

### Static assets (no git bloat)
- `v4/scripts/link-static.mjs` — idempotent script that symlinks `v4/public/static -> ../../public/static`.
  Wired into `dev`/`build`/`check` npm scripts so assets resolve in every mode. At cutover (v4 hoisted
  to repo root) it becomes a no-op.
- `v4/.gitignore` — ignores `public/static` (the symlink/assets stay out of git).
- Verified: `dist/static/{images,favicons,resume.pdf}` are emitted; `/static/resume.pdf` and blog
  images (e.g. `/static/images/goodreads-api.png`) serve `200` in `astro preview`.

### Content rendering polish
- `astro-expressive-code` added (dark `github-dark-default` panels on the light canvas → sketch 006
  vibe; 12px frame radius, wrap on). Owns all code-block rendering.
- `v4/src/plugins/remark-code-titles.mjs` — normalizes legacy ```lang:file``` fences (e.g. `ts:file.ts`,
  `bash:.env`, `js:index.js`) into real `lang` + Expressive Code `title="…"` meta. **Eliminates the
  Shiki "language doesn't exist" warnings** and renders the filename as a frame tab. Verified: 0 build
  warnings; promise post shows `promises.js` / `concurrently.js` / etc. title tabs + copy buttons.
- Twemoji replaced: `v4/src/lib/emoji.ts` (name→codepoint map ported from legacy `css/twemoji.css`)
  + rewritten `v4/src/components/mdx/Twemoji.astro` now render the **real Unicode glyph** (e.g. 🤔 🍻 👋)
  — non-breaking, asset-free, no remote SVG fetch. Unknown names degrade to an empty `<span>`.
- `v4/src/styles/global.css` — article prose retuned for readability (heading scale, h2 rules, list
  markers, links, inline-code scoped to `:not(pre) > code` so it never fights Expressive Code, table
  overflow, twemoji baseline). Removed the old hand-rolled `.prose pre` (EC owns code now).

### Remaining pages (legacy data, static-first)
- `v4/src/pages/about.astro` — ported from `layouts/author-layout.tsx` + `data/authors/default.mdx`:
  intro, career timeline (`CAREER` in `site.ts`), resume link (`/static/resume.pdf`), build-with list,
  socials, support links. Uses real Twemoji.
- `v4/src/pages/projects.astro` + `v4/src/lib/projects.ts` — 16 projects (work/personal) ported from
  `data/projects.ts`, card grid with logos from `/static`, tech chips, external links.
- `v4/src/pages/books.astro` + `v4/src/lib/media.ts` — reads cached `../json/books.json` (Goodreads):
  Currently-reading + Read sections, 25 covers, star ratings, graceful empty state.
- `v4/src/pages/movies.astro` — reads cached `../json/movies.json` (IMDb/OMDB): 98 poster cards sorted
  by my rating then IMDb, graceful empty state.
- **Guestbook deliberately skipped** (no placeholder route added) — later confirmed dropped because production
  `/guestbook` is 404.

### Design polish
- `v4/src/components/studio/StudioShell.astro` — tab strip now horizontally scrollable and includes
  every route (primary + books/movies/tags) so the whole site is reachable on mobile (sidebar/rail
  hide < lg, no horizontal page overflow).
- `v4/src/pages/index.astro` — added an "explore" card grid (snippets/projects/books/movies) and a
  coder "build log" code block, reinforcing the studio motif while staying readable. Live post/snippet
  counts feed the JSON block.

### Verification (real output)
- `bun run check` → **0 errors, 0 warnings, 0 hints** (30 files).
- `bun run build` → **success, 236 page(s) built in ~4s**; **no Shiki/language warnings** (M2 had benign
  ones). 236 = 232 (M2) + `/about` `/projects` `/books` `/movies`.
- Symlink emits assets into `dist/static/**`.
- `astro preview` smoke test — all `200`: `/`, `/blog/does-promise-all-run-in-parallel-or-sequential`,
  `/about`, `/projects`, `/books`, `/movies`, `/snippets`, `/tags`, `/static/resume.pdf`, blog image.
- Rendered HTML spot-checks: projects 16 logos, books 25 Goodreads covers, movies 98 posters,
  homepage explore + build log, post EC frames with copy buttons, Twemoji real glyphs.
- Hermes re-ran `bun run check` and `bun run build` after Claude's pass: check stayed 0/0/0, build stayed 236 pages. Smoke-tested `/`, evergreen blog post, `/about`, `/projects`, `/books`, `/movies`, `/snippets`, `/tags`, `/static/resume.pdf`, and `/static/images/goodreads-api.png` with HTTP 200. Browser console had 0 JS errors on sampled pages.

### Known gaps (next milestones)
- M4 integrations: Spotify now-playing, GitHub-today, activity timeline (RuntimeRail still static
  placeholders), Umami. Views/reactions + guestbook/auth retain decisions still open.
- Search `/search.json` (Pagefind/deferred).
- Books/movies use cached `json/*.json`; swap to a live Drizzle query at cutover if fresh data wanted.
- `vercel.json` Umami `/stats/:match*` rewrite + security headers + optional `/sitemap.xml` alias =
  cutover/hosting milestone.

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
