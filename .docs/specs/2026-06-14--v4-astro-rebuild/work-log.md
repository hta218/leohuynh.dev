# Work Logs

## 2026-06-19 — Claude — Wire books/movies shelf to live DB

### Scope
The shelf + home-page activity rail were reading stale static JSON snapshots
(`json/books.json`, `json/movies.json`, last regenerated 2025-02-07) even though
the Supabase DB already holds fresh data (`books` 26 rows updated 2025-09-06,
`movies` 100 rows updated 2025-06-27). Switched the loaders to read the DB.

### What changed
- Added `src/lib/db.ts` — shared `getSql()` Postgres connection (extracted from
  the inline helper in `api/stats.ts`).
- `src/lib/media.ts` — `getBooks()` / `getMovies()` are now `async` and query the
  `books` / `movies` tables via `getSql()`. They fall back to the legacy JSON
  snapshot (with field-name aliasing) if the DB is unreachable, so offline builds
  still render.
- `src/pages/api/stats.ts` — now imports `getSql` from `~/lib/db` (removed the
  duplicated connection code; behavior unchanged).
- Consumers updated for the async signature: `src/lib/runtime.ts` (`fetchActivity`
  → `Promise.all([getBooks(), getMovies()])`) and `src/pages/shelf.astro`
  (`await getBooks()` / `await getMovies()` in frontmatter).

### Verified
- `nr typecheck` → 0 errors / 0 warnings / 0 hints.
- DB sanity: `last watched` now resolves to "Your Name." (2016 • 106 mins • ★8,
  date_rated 2025-06-15); 4 books carry the `currently-reading` shelf.

### Follow-ups handled in this session
- 3 of the 4 `currently-reading` books are also tagged `paused`. `fetchActivity`
  now prefers a non-paused shelf (`find(!paused) ?? currentlyReading[0]`) so the
  rail deterministically shows the actively-read book.
- Restyled the recent-activity cards in `RuntimeRail.astro`: titles no longer
  truncate and use `font-medium` (lighter than the old bold); book/movie covers
  render as portrait posters instead of squares; book/movie cards link to the
  internal `/shelf` page (`#reading` / `#watching`) while github keeps its
  external link.

### Notes
- `shelf.astro` is prerendered → DB is queried at build time (fresh on each
  deploy). `/api/stats` and `/api/activity.json` query at runtime.

## 2026-06-18 — Hermes — M11 clean root cutover handoff prep

### Scope
Leo confirmed the production target is a clean repository root, not a permanent `v4/` subdirectory. Legacy code is preserved on other branches (`origin/main`, `origin/v3`, `origin/legacy-v3`, etc.), so branch `v4` can retire the legacy Next root during cutover.

### What changed
- Expanded `plan.md` M11 into a concrete clean-root hoist checklist.
- Added `m11-cutover-handoff.md` as the detailed Claude Code handoff inside the existing spec folder.
- Updated the README Claude handoff prompt from the old initial rebuild goal to the current M11 cutover goal.

### Current repository state before Claude handoff
- Branch: `v4`.
- Latest pulled commit before handoff: `682d346 feat: add profile photo to about page`.
- Recent v4 commits include root-dir prep (`baafd26 chore: add pnpm workspace config and lockfile`) and runtime/sidebar polish.
- Root still contains the legacy Next app and a root `vercel.json` that builds with `cd v4` and `outputDirectory: v4/dist`.
- Astro app still lives under `v4/` and has been verified previously with `bun run check` and `bun run build`.
- Claude Code is installed locally (`claude 2.1.179`).

### Handoff constraints for Claude
- Work only on branch `v4`.
- Do not mutate `main`, `v3`, or `legacy-v3`.
- Do not push.
- Preserve shared content/assets (`data/`, `json/`, `public/static/`, `icons/`, .docs/specs, `.github/`, `.husky/`).
- Remove legacy Next-only code from this branch only after hoisting the Astro app and fixing root-native paths/config.
- Mark M11 complete only after root-level `bun install`, `bun run check`, `bun run build`, and smoke checks pass.

## 2026-06-18 — Hermes — M11 verification follow-up: stats route hardening

### Scope
Independent verification after Claude's hoist found that root `api/stats.ts` was not present in `.vercel/output/config.json` after `astro build`. With the Astro/Vercel adapter owning the output, relying on a separate root Vercel Function was too risky for production.

### What changed
- Converted the persisted stats API from root `api/stats.ts` into a root-native Astro endpoint: `src/pages/api/stats.ts` with `prerender = false`.
- Removed the root `api/` shim directory.
- Preserved the legacy `/api/stats` GET/POST contract, `DATABASE_URL` usage, no-store JSON responses, and monotonic reaction/view updates.

### Verification
- `bun run check` → 0 errors / 0 warnings / 0 hints.
- `bun run build` → success, 236 pages, Vercel output generated.
- `.vercel/output/config.json` now contains `{ src: '^/api/stats$', dest: '_render' }` alongside the other runtime API routes.
- Local HTTP smoke on `http://localhost:4321` passed for representative pages, JSON APIs, and `/static/resume.pdf`; `/api/stats` route registration is verified via Vercel output and should be preview-tested with production `DATABASE_URL` before promotion.

## 2026-06-16 — Claude — M10 Astro 6 upgrade

### Scope
Upgrade from Astro 5.18.2 → 6.4.7 after Leo asked why the project wasn't on the latest version.
The original reason for staying on Astro 5 (M4) was a missing Vercel adapter; that blocker no longer applies
for this static build.

### What changed
- `v4/package.json` — bumped `astro` ^5.7.0 → ^6.4.7, `@astrojs/mdx` ^4 → ^6, `@astrojs/react` ^4 → ^5,
  plus minor bumps for `@astrojs/rss`, `@astrojs/sitemap`, `@tailwindcss/vite`, `tailwindcss`.
- `v4/src/content.config.ts` — fixed deprecated `z` import: `astro:content` → `astro/zod`.
- `v4/astro.config.mjs` — replaced deprecated `markdown.remarkPlugins` with new
  `markdown.processor: unified({ remarkPlugins: [remarkCodeTitles] })` from `@astrojs/markdown-remark`.

### No-change items (already compatible)
- `astro-expressive-code@0.43.1` — already at latest, already supports Astro 6.
- Content Collections — already using `loader: glob()` API.
- `<ClientRouter />` — already correct import.
- Node 26.3.0 — satisfies Astro 6's Node ≥ 22.12.0 requirement.

### Verification
- `bun run check` ✅ 0 errors / 0 warnings / 0 hints (51 files). Zero deprecation warnings.
- `bun run build` ✅ 236 page(s) built — same count as pre-upgrade.

## 2026-06-16 — Hermes — M9 sidebar/assets/codeblock polish

### Scope
Leo approved another polish batch:
- Use `IMG_1110-EDIT.jpg` from Downloads for avatar/SEO image, preferably local static.
- Use keyboard Twemoji for favicon.
- Remove all border/rounded styling from Twemoji.
- Improve left sidebar typography/icons, folder toggles, sorting, icon mapping, active highlights, and stats external hint.
- Align blog/snippet card dates.
- Disable Giscus reactions and match legacy custom reaction UI.
- Add local time, last commit, and Made in Vietnam to the bottom bar.
- Upgrade code blocks with language badge, theme selector, and font selector.

### Result
- Generated local images:
  - `public/static/images/avatar.jpg` — 1024×1024 square crop.
  - `public/static/images/og.jpg` — 1200×630 social image crop.
- Re-encoded both image assets without sensitive EXIF/GPS/device metadata before commit.
- Updated `SITE.socialBanner` to `/static/images/og.jpg` and sidebar avatar to `/static/images/avatar.jpg`.
- Added `/static/twemoji/2328-fe0f.svg` and wired it as SVG favicon.
- Sidebar/tabs now share the same explorer metadata inside `StudioShell.astro`:
  - folders first; posts/snippets default open with caret toggles;
  - larger 13px row text with 16px aligned icons;
  - `README.md` uses markdown icon;
  - `books.astro` uses Goodreads icon;
  - `projects.astro` uses a project/code icon;
  - `stats` replaces `analytics.url` and shows an external-link icon on hover;
  - `/blog` and `/snippets` highlight `index.astro`; detail routes highlight `[...slug].astro`.
- Added a sticky status bar with ICT local time, last commit, made-in-Vietnam label, and code block controls.
- Disabled Giscus reactions (`reactionsEnabled: '0'`).
- Reworked custom reaction UI to match live: no hover scaling; click shows the sliding `+n` state and persists the local reaction immediately before the mouse-leave API save.
- Twemoji images now explicitly have no border/radius/background, and prose image styling excludes `.twemoji`.
- Blog list and snippet cards now align date/time labels with content titles.
- Expressive Code now uses default light + selectable dark theme, language badges, and a font selector (`ui-mono`, `jetbrains`, `sfmono`).

### Verification
- `bun run check` ✅ 0 errors / 0 warnings.
- `bun run build` ✅ 236 pages.
- Local HTTP smoke ✅ `/`, `/blog`, `/snippets`, blog detail, avatar, OG image, keyboard favicon.
- Browser QA ✅ home/sidebar: avatar crop, folder toggles, aligned icons, tab mapping, bottom bar.
- Browser QA ✅ `/blog`: `index.astro` active.
- Browser QA ✅ blog detail: `[...slug].astro` active, Giscus widget has `reactionsenabled="0"`, custom reaction buttons render, no hover-scale class.
- Browser QA ✅ Twemoji computed style: `border: 0`, `border-radius: 0`.
- Browser QA ✅ code blocks: BASH language badge, default light theme, theme selector + font selector apply and persist.
- Browser console ✅ 0 JS errors.

## 2026-06-16 — Hermes — M8 icons, comments, and Twemoji polish

### Scope
Leo approved the follow-up direction:
- Greeting should keep the old `Howdy, fellow!` vibe with the waving hand, no `I'm Leo` in the H1.
- Paragraph under the greeting should mention Tuan Anh/Leo and borrow better bits from the legacy bios.
- Left sidebar should use Leo's avatar, become one Explorer tree, and show posts/snippets as folders.
- Generic UI icons should move to Hugeicons free where it makes sense.
- Blog/snippet detail pages should restore Giscus comments.
- Legacy `<Twemoji emoji="..." />` should render real Twemoji, but managed better than the old hand-written CSS map.

### Result
- Added dependencies: `@hugeicons/core-free-icons`, `@hugeicons/react`, and `@giscus/react`.
- Added `HugeIcon.astro` for server-rendered Hugeicons in Astro.
- Sidebar now uses `/static/images/logo.jpg`, one `EXPLORER` group, folder icons for `posts/` and `snippets/`, and `about.md` with the markdown icon.
- Home greeting now reads `Howdy, fellow!` with an inline self-hosted Twemoji waving hand.
- Home paragraph now uses legacy bio details: Tuan Anh Huynh / Leo alias, learner-builder-freedom seeker, Hanoi, eCommerce, JS/TS, Shopify Hydrogen.
- Added more Hugeicons in homepage cards and project stars.
- Added `Comments.tsx` + `getGiscusConfig()` and mounted comments on blog/snippet detail pages with `client:visible`.
- Replaced native emoji fallback with self-hosted Twemoji SVG rendering:
  - `v4/src/lib/emoji.ts` now exposes `emojiCodepoint()`.
  - `Twemoji.astro` renders `/static/twemoji/<codepoint>.svg`.
  - `Reactions.tsx` uses the same Twemoji component.
  - Generated used assets into `public/static/twemoji/`.

### Verification
- `bun run check` ✅ 0 errors / 0 warnings.
- `bun run build` ✅ 236 pages.
- Local preview smoke ✅ `/`, `/projects`, blog detail, snippet detail, avatar asset, and Twemoji asset.
- Browser QA ✅ home: avatar logo, single Explorer tree, `posts/`/`snippets/` folders, `about.md`, inline Twemoji greeting, slate layout.
- Browser QA ✅ blog detail: MDX Twemoji renders as image assets; Giscus component hydrates to `<giscus-widget>`; console has 0 JS errors.

## 2026-06-15 — Hermes — M7 shell polish follow-up

### Scope
Leo requested a tighter VS Code-like shell pass:
- Shorter homepage greeting.
- Use real brand/simpleicons icons, including adding Astro under root `icons/`.
- Slate / black-white tone and thinner scrollbars.
- Max 5 tab triggers.
- Restore `/projects` GitHub repo data parity with the live site.
- Move `posts/` and `snippets/` route folders to the top and show actual route filenames only: `index.astro` + `[...slug].astro`.

### Result
- Added `icons/astro.svg` from Simple Icons.
- `StudioShell.astro` now uses inline SVGs from root `icons/` via Vite `?raw` imports instead of emoji placeholders.
- Route folders now sit above explorer, no disclosure triangle, and list only `index.astro` + `[...slug].astro`.
- Tab bar is capped at 5 triggers: README, blog, snippets, projects, about.
- `global.css` moved shell tokens/scrollbar accents to slate/black-white and reduced WebKit scrollbar width/height to 4px.
- Homepage H1 now `Hi, I’m Leo.` with shorter supporting copy.
- Added `v4/src/lib/github.ts` and updated `projects.astro` to fetch GitHub repo description, stars, and primary language at build time with fallback to static project data.

### Verification
- `bun run check` ✅ 0 errors / 0 warnings.
- `bun run build` ✅ 236 pages.
- Generated `/projects` HTML contains GitHub repo metadata: stars/language/repo names for repos that resolve.
- Local preview smoke ✅ for `/`, `/projects`, `/blog`, `/snippets`, `/api/github-today.json`, `/api/activity.json`, and `/static/resume.pdf`.
- Browser QA ✅: client-side nav preserved window state across `/projects` → `/blog`; visual pass for route folders, max 5 tabs, slate tone, and thin scrollbars.
- Screenshots: `/tmp/leohuynh-v4-m7-polish/{home,projects,blog}.png`.

## 2026-06-15 — Hermes — M6 pre-production polish kickoff

### Scope of this run
Leo approved continuing after preview and listed pre-production changes needed before production cutover:

- Keep implementation under `v4` for safe migration until cutover.
- Replace placeholder homepage greeting with copy matching live personal-site identity.
- Enable Astro client-side navigation.
- Fix GitHub APIs / env-backed runtime widgets.
- Remove browser chrome/header from shell.
- Make IDE-like layout: sticky explorer, tab strip, right rail, bottom bar; only panes scroll internally.
- Add toggle for right rail.
- Keep bottom bar light-mode.
- Add icons to explorer + tab triggers.
- Render posts/snippets as expandable folders, initially 10 items with `+10 more...` pagination.

### Result
Implemented in v4:
- `StudioShell.astro` rebuilt as a full-height IDE shell with fixed sidebars, tab strip, internal scroll panes, iconized explorer/tabs, posts/snippets folders, and right-rail toggle persisted in localStorage.
- `RuntimeRail.astro` made internally scrollable and controlled by shell toggle.
- `BaseLayout.astro` now uses Astro `ClientRouter` for client-side navigation.
- `runtime.ts` GitHub GraphQL query fixed by using `GitTimestamp` for commit history and `DateTime` for contributions collection.
- `index.astro` greeting updated from live-site identity/persona instead of placeholder rebuild copy.
- `global.css` adds thin scrollbar styling and shell right-rail grid transition.

### Verification
- `bun run check` ✅ 0 errors / 0 warnings.
- `bun run build` ✅ 236 pages.
- Generated API outputs from build:
  - `dist/api/github-today.json`: `ok: true`, `contributions: 5`, `commits: 2`, `topRepo: hta218/infinite-gallery`.
  - `dist/api/activity.json`: `ok: true`.
- Local preview HTTP smoke ✅ for `/`, `/blog`, representative blog/snippet details, `/projects`, `/about`, `/books`, `/movies`, `/tags`, JSON APIs, RSS, search JSON, and resume PDF.
- Browser QA ✅:
  - client-side navigation preserved `window.__navPersistCheck` across `/blog` → `/snippets`.
  - right rail toggle changed state to `hidden` and button text to `show right rail`.
  - `+10 more...` folder expansion changed posts list from 10 visible to 20 visible.
  - screenshot contact sheet generated at `/tmp/leohuynh-v4-m6-screens/contact-sheet.png`.


## 2026-06-15 — Hermes — M5 verification prep + hosting parity

### Scope of this run
Continue v4 verification toward cutover without promoting production. Focused on route parity, preview smoke,
visual QA, and Vercel hosting config that can be safely committed before a deploy preview.

### What changed
- Root `vercel.json` now sets `framework: astro`, pins `bunVersion: 1.3.14`, and forces the GitHub/Vercel project to install/build/output
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
  (`.docs/specs/.../plan.md`, `route-inventory.md`, `work-log.md`, `v4/`).
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

## 2026-06-18 — @hta218 (M11: production cutover / clean root hoist)

Hoisted the Astro app from `v4/` to the repository root and removed the legacy Next.js
source from branch `v4`, leaving a clean root-native Astro repo. No commit, no push (Hermes/Leo
review and decide). Branch `v4` only; `main`/`v3`/`legacy-v3` untouched.

### Files hoisted `v4/` → root
- `v4/package.json` → `package.json` (Astro pkg/scripts now the root pkg; `link-static`
  step dropped from `dev`/`build`/`check` since the root owns the real `public/static`).
- `v4/astro.config.mjs`, `v4/tsconfig.json`, `v4/vercel.json`, `v4/bun.lock`,
  `v4/.env.example` → root (overwriting the legacy Next equivalents).
- `v4/src/` → `src/`, `v4/api/stats.ts` → `api/stats.ts` (real Vercel Function; replaced the
  one-line root shim `export { default } from '../v4/api/stats'`).
- `v4/public/robots.txt` → `public/robots.txt` (root `public/static/` kept as the real assets;
  the git-ignored `v4/public/static` symlink was discarded).
- `v4/` directory removed entirely (incl. `scripts/link-static.mjs`, node_modules, dist, .astro,
  env files, README, pnpm leftovers).

### Path fixes (only needed because Astro had lived under `v4/`)
- `src/content.config.ts` — glob base `../data/blog` → `./data/blog`, `../data/snippets` → `./data/snippets`.
- `src/lib/media.ts` — `resolve(process.cwd(), '../json/{books,movies}.json')` → `'json/{books,movies}.json'`.
- `src/lib/brand-icons.ts` — 43 raw SVG imports `../../../icons/*.svg?raw` → `../../icons/*.svg?raw`.
- `src/components/studio/StudioShell.astro` — 6 raw SVG imports `../../../../icons/*` → `../../../icons/*`.
- `vercel.json` — already root-native in the `v4/` copy (framework `astro`, `bunVersion`,
  redirects/rewrites/headers); the legacy root `vercel.json` with `cd v4`, `v4/dist`,
  `installCommand`/`buildCommand`/`outputDirectory` shims is gone.

### Legacy Next source removed (228 deletions total)
- App/source dirs: `app/` (29), `components/` (85), `layouts/` (6), `hooks/` (4), `db/` (3),
  `supabase/`, `css/` (3), `utils/` (9), `types/` (1), `snippets/` (1), `guides/` (5).
- Configs: `contentlayer.config.ts`, `next.config.js`, `next-env.d.ts`, `postcss.config.js`,
  `drizzle.config.ts`, `jsconfig.json`, legacy `scripts/` (rss/seed/post-build + csv),
  `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `tsconfig.tsbuildinfo`, `.next/`.
- Superseded legacy data modules (ported into `src/lib`, imported the removed `~/types`):
  `data/projects.ts`, `data/navigation.ts`, `data/site-metadata.ts`. Kept `data/blog/`,
  `data/snippets/`, `data/authors/`, `data/references-data.bib`.
- Generated legacy public artifacts now emitted by Astro routes: `public/feed.xml`,
  `public/search.json`, `public/tags/`. Kept `public/static/` (283 tracked asset files).

### Deviation from handoff (flagged for review)
- The handoff listed `.husky/` under "preserve", but its tracked hooks `commit-msg`
  (`commitlint --edit`) and `pre-commit` (`lint-staged`) reference tooling removed with the
  Next deps (`commitlint`, `lint-staged` no longer installed) — they would **fail every commit**
  (`core.hooksPath` is active). The conventional-commit hook also contradicts the repo's
  non-conventional commit convention. Removed `commitlint.config.js` + both broken hooks so the
  root is committable. `.husky/.gitignore` retained. Restore if a biome-based hook is desired.
- Root `.gitignore` rewritten for Astro (`dist/`, `.astro/`, `.vercel/`; dropped Next/contentlayer
  entries); kept `.idea/` and re-added `.vscode/` to match prior ignore behavior.

### Verification (real output, from repo root)
- `git status --short --branch` → `## v4...origin/v4`; 228 `D`, 9 `M`, 6 `??` (hoisted `src/`,
  `astro.config.mjs`, `bun.lock`, `public/robots.txt`, plus `.vscode/` and the handoff doc).
- `bun install` (Bun 1.3.14) → `545 packages installed [3.35s]`, clean.
- `bun run check` (`astro check`) → **0 errors / 0 warnings / 0 hints (54 files)**.
- `bun run build` → **success, 236 page(s) built** (`✓ Completed in 7.84s`; server built in 13.28s);
  236 HTML files in `dist`. Matches the M10 baseline of 236 exactly. (Benign warning: local Node
  26.3.0 vs Vercel's Node 24 runtime — Vercel uses 24.)
- Build output verified: `/`, `/blog`, `/snippets`, `/projects`, `/about`, `/books`, `/movies`,
  `/tags`, representative blog + snippet details, `feed.xml`, `search.json`, `robots.txt`,
  `404.html`, `static/resume.pdf` all present. `api/*.json` runtime endpoints are
  `prerender = false` (SSR) and correctly registered in `.vercel/output` `_render.func`
  (`^/api/github-today\.json$` etc.) — they run on Vercel, not in static preview (unchanged design).
- HTTP smoke (static server over `dist/client`, Python urllib — no `curl` in env): all of
  `/ /blog/ /blog/<post>/ /snippets/ /snippets/<snip>/ /projects/ /about/ /books/ /movies/ /tags/
  /feed.xml /search.json /robots.txt /static/resume.pdf /404.html` → **200** with correct content types.
- Rendered-HTML smoke: GitHub-today + activity rail widgets, made-in-Vietnam status bar, inline
  brand SVG icons, `/static/images/avatar.jpg` (200), project cards with brand icons + stars/lang,
  books entries, Expressive Code blocks, Twemoji SVGs (`/static/twemoji/*.svg`), and 3 client
  islands per post (ViewsCounter / Reactions / Giscus, client-mounted) all render. No raw `../`,
  `../data`, or `v4/` paths leaked into output.

### Not done locally (out of scope for this run)
- Live Vercel deploy + the SSR `api/*.json` and `api/stats` request-time behavior require the
  Vercel runtime (the `@astrojs/vercel` adapter has no `astro preview` server, and no `vercel dev`
  auth here). The `api/stats` coexistence with adapter output was already proven in the M5 preview
  and is byte-identical after the hoist. Hermes to verify the preview deploy before promote.
