# v4 Astro rebuild — implementation plan

Scope-controlled, incremental plan for rebuilding `leohuynh.dev` as v4 on branch `v4`
using Astro + Bun + Astro Content Collections + MDX + Tailwind v4, following the
`sketches/006-fullscreen-code-studio` design direction.

> Source of truth: this spec folder. Read `README.md` first, then this plan, then `work-log.md`.

## Guardrails

- Branch: `v4` only. Never switch to / mutate `main`, `v3`, or `legacy-v3`.
- Preserve all existing blog/snippet URLs and SEO (see `route-inventory.md`).
- No secrets committed. `.env` stays untracked; only `.env.example` keys are referenced.
- Static-first Astro. React islands only for client-interactive widgets (Spotify, search, theme).
- Verify every milestone with a real `bun run build`.

## Where v4 lives during migration

To avoid destroying the legacy Next.js app (which is the migration reference), the v4
Astro app is scaffolded in a dedicated **`v4/`** subdirectory at repo root for now:

```
leohuynh.dev/
├── app/ components/ data/ ...   ← legacy Next.js (untouched, reference only)
├── v4/                          ← new Astro app (this rebuild)
│   ├── package.json (bun)
│   ├── astro.config.mjs
│   ├── src/
│   └── ...
└── .docs/specs/2026-06-14--v4-astro-rebuild/
```

Content is **not duplicated**: the v4 Content Collections load the existing
`data/blog/*.mdx` and `data/snippets/*.mdx` via Astro's glob loader pointed at `../data`.
This keeps a single source of truth for MDX during migration.

**Cutover (future milestone, not this run):** once v4 reaches parity, hoist `v4/` to repo
root (or flip the build), retire the Next.js app, and update Vercel project root dir.

## Tech decisions

| Concern        | Choice                                                                 |
| -------------- | ---------------------------------------------------------------------- |
| Framework      | Astro 5 (static output)                                                |
| Runtime/PM     | Bun                                                                     |
| Content        | Astro Content Collections (`glob` loader → `../data/blog`, `../data/snippets`) |
| Authoring      | MDX (`@astrojs/mdx`)                                                    |
| Styling        | Tailwind v4 via `@tailwindcss/vite`, tokens from sketch 006            |
| Code blocks    | `astro-expressive-code` (Shiki under the hood) — defer until content render milestone |
| Islands        | `@astrojs/react` for interactive widgets only                          |
| RSS / sitemap  | `@astrojs/rss` + `@astrojs/sitemap`                                     |
| Search         | Pagefind (deferred — open question in README)                          |

## Milestones

### M0 — Plan + inventory (this run)
- [x] `plan.md`
- [x] `route-inventory.md`
- [x] `work-log.md`

### M1 — Scaffold + content schema (this run, controlled)
- [x] `v4/` Astro+Bun project (config, tsconfig, gitignore)
- [x] Tailwind v4 wired with design tokens from sketch 006
- [x] `src/content.config.ts` — `blog` + `snippets` collections with Zod schema mirroring `contentlayer.config.ts`
- [x] Base layout + homepage shell rendering the 006 "Fullscreen Code Studio" structure (static)
- [x] Blog index + snippet index listing from collections (validates schema end-to-end)
- [x] `bun install` + `bun run build` green
- Article body rendering (full MDX with `Twemoji` etc.) is intentionally deferred to M3.

### M2 — URL & SEO parity ✅ (2026-06-14)
- [x] `/blog/[slug]`, `/blog/page/[page]`, `/snippets/[slug]` routes with slug parity
- [x] `/tags`, `/tags/[tag]` + build-time tag counts (`src/lib/content.ts`, `github-slugger`)
- [x] `/feed.xml`, `/tags/[tag]/feed.xml`, sitemap, `robots.txt`, `404`
- [x] Redirect `/snippets/crawling-goodreads-books-data` → `/blog/crawling-goodreads-books-data` (301)
- [x] Canonical / OG / Twitter image parity from `site` + frontmatter; `trailingSlash: 'never'`
- [x] Diff v4 build routes against `route-inventory.md` (see "v4 build route inventory — M2")
- Note: full MDX body now renders (Twemoji placeholder); `/static` assets + Expressive Code still M3.

### M3 — Design + content rendering ✅ (2026-06-14)
- [x] Convert 006 mockup into production components (titlebar, sidebar explorer, runtime rail, status bar)
- [x] Responsive collapse to single column < 1050px (+ scrollable tab strip carries all routes on mobile)
- [x] Full MDX rendering: real `Twemoji` glyphs, Expressive Code (with legacy `lang:title` fence
      normalization → 0 Shiki warnings), images from symlinked `public/static`
- [x] Clean article / snippet / project / about / books / movies pages
- Guestbook **dropped / not in scope** (production `/guestbook` is 404 and no guestbook code exists,
  so there is no route to migrate). Books/movies render from cached `json/*.json` (static, no DB).
  RuntimeRail widgets remain static placeholders → M4 integrations.

### M4 — Integrations (graceful fallback first) ✅ (2026-06-14)
- [x] Spotify now playing JSON + rail widget (build-time/static JSON fallback; real values when env is present)
- [x] GitHub today JSON + rail widget (contribs / commits / optional lines / top repo; unavailable state when token missing)
- [x] Recent activity timeline (cached books/movies + optional Spotify/GitHub)
- [x] Umami analytics script support (`PUBLIC_UMAMI_WEBSITE_ID` or legacy `NEXT_UMAMI_ID`) + analytics nav link
- [x] Static `/search.json` for posts/snippets
- [x] Views + reactions **retained** — implemented as client React islands plus a Vercel Function
      (`api/stats.ts`) that preserves the legacy `/api/stats` GET/POST contract against the existing
      `stats` table when `DATABASE_URL` is configured. Plain `astro preview` still falls back cleanly
      because it does not serve Vercel Functions.
- [x] Guestbook **dropped / not in scope** — production `/guestbook` is 404 and no guestbook code
      exists, so there is nothing to migrate. Removed the prior "retain decision pending" language.
- Note: request-time endpoints that require Astro rendering are still deferred until the Astro/Vercel adapter
  version is compatible with this Astro version. Views/reactions are handled separately by `api/stats.ts`,
  a Vercel Function that can coexist with the static Astro output.

### M5 — Verify + preview deploy ✅ (2026-06-15)
- [x] typecheck / lint / build green
- [x] Route inventory diff clean, RSS/sitemap/canonical/OG verified
- [x] Desktop + mobile screenshots
- [x] Vercel preview deploy green after legacy root `next` patch
- [x] Preview smoke: routes, redirects, `/api/stats`, static JSON APIs, Umami, browser console

### M6 — Pre-production polish requested by Leo (2026-06-15)
- [x] Explain/retain `v4/` as safe migration workspace, then hoist to root only in final cutover phase.
- [x] Replace placeholder homepage greeting/copy with personal-site copy based on the live site.
- [x] Enable Astro client-side navigation so internal links do not full page reload.
- [x] Fix GitHub today API GraphQL type mismatch; env is present, current failure is query/schema.
- [x] Remove the browser-like top chrome/header from the studio shell.
- [x] Refactor shell into a VS Code-like IDE viewport: sticky tab triggers, sticky left/right sidebars, sticky bottom bar, only content pane scrolls.
- [x] Make left/right sidebars internally scrollable with thin controlled scrollbars.
- [x] Add right sidebar show/hide trigger.
- [x] Make bottom bar light-mode.
- [x] Add icons to left sidebar nav and tab triggers.
- [x] Render `posts/` and `snippets/` as folders in the left explorer, each initially showing 10 files with `+10 more...` expansion controls.
- [x] Re-run check/build, local screenshot review.
- [x] Push and smoke-test Vercel preview for Leo.

### M7 — Shell polish follow-up requested by Leo (2026-06-15)
- [x] Shorten homepage greeting so it no longer dominates the page.
- [x] Replace emoji route/file icons with real icons from root `icons/`; add `icons/astro.svg` from Simple Icons.
- [x] Shift shell tone to slate / black-white and remove blue/purple scrollbar accents.
- [x] Reduce scrollbar width.
- [x] Cap tab bar triggers to 5.
- [x] Restore `/projects` GitHub repo data parity: repo description, stars, primary language.
- [x] Move `posts/` and `snippets/` route folders above explorer.
- [x] Show actual route filenames only: `index.astro` + `[...slug].astro`.
- [x] Re-run check/build, local smoke, browser QA, and screenshots.

### M8 — Icons/comments/Twemoji follow-up requested by Leo (2026-06-16)
- [x] Use `Howdy, fellow!` greeting with inline waving-hand Twemoji and no `I'm Leo` in H1.
- [x] Rewrite home paragraph using current bios details: Tuan Anh Huynh / Leo alias, learner-builder-freedom seeker, Hanoi, JS/TS, eCommerce, Shopify Hydrogen.
- [x] Use `/static/images/logo.jpg` avatar in the left sidebar logo area.
- [x] Collapse sidebar to one Explorer tree.
- [x] Use folder icons for `posts/` and `snippets/`, with children `index.astro` and `[...slug].astro`.
- [x] Rename about route display to `about.md` with markdown icon.
- [x] Integrate Hugeicons free for generic UI/nav icons while keeping Simple Icons for brand marks.
- [x] Restore Giscus comments on blog and snippet detail pages.
- [x] Replace native emoji rendering with managed self-hosted Twemoji SVG assets instead of a hand-written CSS class map.
- [x] Re-run check/build, local smoke, browser QA.

### M9 — Sidebar/assets/codeblock polish requested by Leo (2026-06-16)
- [x] Crop `~/Downloads/IMG_1110-EDIT.jpg` into local static avatar and 1200×630 OG image, then strip sensitive EXIF/GPS metadata.
- [x] Use local avatar in sidebar and local OG image for default SEO/social image.
- [x] Add keyboard Twemoji SVG favicon.
- [x] Remove rounded corners/borders from all Twemoji images inside posts and reactions.
- [x] Increase sidebar row text/icons to a more readable/harmonized size.
- [x] Refactor explorer/tab data to one source of truth so tab trigger icon/file mapping matches the sidebar.
- [x] Add default-open caret toggles for posts/snippets folders.
- [x] Align folder/file icons and sort folders before files.
- [x] Use markdown icon for `README.md`, Goodreads icon for `books.astro`, project icon for `projects.astro`, and `stats` external-link affordance.
- [x] Remove trailing slash labels from `posts`, `snippets`, and `tags`.
- [x] Highlight `index.astro` for `/blog` and `/snippets`, and `[...slug].astro` for detail routes.
- [x] Fix blog/snippet card date alignment.
- [x] Disable Giscus reactions and keep only the custom reaction bar.
- [x] Match legacy reaction behavior: no hover scale, click shows sliding `+n` state.
- [x] Add sticky bottom status bar with ICT local time, last commit, and made-in-Vietnam badge.
- [x] Upgrade code blocks with language badge, default light/dark theme selector, and font selector.
- [x] Re-run check/build, local smoke, browser QA.

### M10 — Astro 6 upgrade ✅ (2026-06-16)
- [x] Bump `astro` ^5.7.0 → ^6.4.7 and all official integrations to Astro-6-compatible majors:
      `@astrojs/mdx` ^4 → ^6, `@astrojs/react` ^4 → ^5, `@astrojs/rss` + `@astrojs/sitemap` minor bumps.
- [x] Fix deprecated `z` import: `import { z } from 'astro:content'` → `import { z } from 'astro/zod'`
      in `src/content.config.ts`.
- [x] Fix deprecated `markdown.remarkPlugins` → `markdown.processor: unified({ remarkPlugins })` from
      `@astrojs/markdown-remark` in `astro.config.mjs`.
- [x] `bun install` — lockfile updated, 42 packages refreshed.
- [x] `bun run check` → 0 errors / 0 warnings / 0 hints (51 files). No deprecation warnings.
- [x] `bun run build` → 236 page(s) built. Same count as pre-upgrade.
- Notes:
  - `astro-expressive-code@0.43.1` already supports Astro 6 — no change needed.
  - Content Collections already use the new `loader: glob()` API — no change needed.
  - `<ClientRouter />` import already correct — no change needed.
  - Node 26.3.0 satisfies Astro 6's Node ≥ 22.12.0 requirement.

### M11 — Production cutover / clean root hoist ✅ (2026-06-18)

Leo confirmed the goal is a clean final repository, not a permanent `v4/` subdirectory. Legacy code is already preserved on other branches (`origin/main`, `origin/v3`, `origin/legacy-v3`, etc.), so branch `v4` should become the Astro root.

Use `m11-cutover-handoff.md` as the detailed Claude Code handoff for this milestone.
See `work-log.md` 2026-06-18 entry for exact files, command outputs, and smoke results.

- [x] Preflight:
  - [x] Stay on branch `v4`; do not mutate `main`, `v3`, or `legacy-v3`.
  - [x] Confirm current root dirty files are only generated/noise or intentional spec updates.
  - [x] Preserve `data/`, `json/`, `public/static/`, `icons/`, `.github/`, .docs/specs, and non-secret project metadata. (`.husky/` broken hooks removed — see work-log deviation.)
- [x] Hoist Astro app from `v4/` to repo root:
  - [x] Move Astro root files (`package.json`, `astro.config.mjs`, `tsconfig.json`, `src/`, `api/`, public files, `bun.lock`) to root. (`scripts/link-static.mjs` dropped — root owns `public/static`.)
  - [x] Remove the `v4/` directory after its contents are hoisted.
  - [x] Replace the root legacy Next `package.json`/scripts/deps with the Astro package.
- [x] Remove/retire legacy Next app from branch `v4` production path:
  - [x] Remove root Next-only source/config that is no longer used (`app/`, legacy `components/`, `layouts/`, `hooks/`, `db/`, `supabase/`, `contentlayer.config.ts`, `next.config.*`, etc. — 228 deletions).
  - [x] Keep shared content/assets and any config still required by Astro.
- [x] Fix all subdirectory path assumptions:
  - [x] Content globs `../data/*` -> `./data/*`.
  - [x] Cached media JSON `../json/*` -> `./json/*`.
  - [x] Root icon imports lose one `../` level after hoist (43 in `brand-icons.ts`, 6 in `StudioShell.astro`).
  - [x] Static asset symlink script removed because root owns `public/static`.
  - [x] `/api/stats` is now a root-native Astro endpoint at `src/pages/api/stats.ts` and is registered in Vercel output as `^/api/stats$ -> _render`.
- [x] Update hosting config:
  - [x] Root `vercel.json` no longer contains `cd v4`, `v4/dist`, or root-directory shims.
  - [x] Redirects, rewrites, headers, Bun version, and Astro framework config remain intact.
- [x] Verification from repo root:
  - [x] `bun install` → 545 packages, clean.
  - [x] `bun run check` → 0 errors / 0 warnings / 0 hints (54 files).
  - [x] `bun run build` → 236 pages built (matches M10 baseline exactly).
  - [x] Local HTTP smoke for representative pages, static JSON, `/feed.xml`, `/search.json`, `/static/resume.pdf`, right rail, statusbar, project cards → all 200 / render OK. (Live SSR `api/*.json` + `/api/stats` need the Vercel runtime — Hermes to verify on preview deploy.)
- [x] Update `work-log.md` with exact changed files, command outputs, smoke results, blockers if any.
- [ ] Commit as `refactor: hoist astro v4 to repository root` only after verification passes; do not push until Hermes/Leo approve. **(Left for Hermes/Leo — no commit/push performed.)**

## Files & folders this feature touches

Created (this run):
- `.docs/specs/2026-06-14--v4-astro-rebuild/plan.md`
- `.docs/specs/2026-06-14--v4-astro-rebuild/route-inventory.md`
- `.docs/specs/2026-06-14--v4-astro-rebuild/work-log.md`
- `v4/` (new Astro app — package.json, astro.config.mjs, tsconfig.json, .gitignore, README.md)
- `v4/src/content.config.ts`
- `v4/src/styles/global.css`
- `v4/src/layouts/BaseLayout.astro`
- `v4/src/components/*` (studio shell pieces)
- `v4/src/pages/index.astro`, `v4/src/pages/blog/index.astro`, `v4/src/pages/snippets/index.astro`
- `v4/src/lib/site.ts` (ported subset of `data/site-metadata.ts`, no secrets)

Read-only references (NOT modified):
- `app/**`, `components/**`, `layouts/**`, `data/**`, `contentlayer.config.ts`, `scripts/rss.ts`,
  `next.config.js`, `data/site-metadata.ts`, `data/navigation.ts`, `data/projects.ts`

Future milestones will add: `v4/src/pages/blog/[...slug].astro`, `v4/src/pages/snippets/[...slug].astro`,
`v4/src/pages/tags/**`, RSS/sitemap endpoints, integration islands under `v4/src/components/widgets/`.

Views/reactions run (added): `v4/src/types/stats.ts`, `v4/src/lib/stats.ts` (client compat layer),
`v4/src/components/widgets/ViewsCounter.tsx`, `v4/src/components/widgets/Reactions.tsx`, and
`v4/api/stats.ts` (Vercel Function for persisted stats); wired into
`v4/src/pages/blog/[...slug].astro` and `v4/src/pages/snippets/[...slug].astro`.
