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
└── docs/specs/2026-06-14--v4-astro-rebuild/
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

### M5 — Verify + cutover
- [x] typecheck / lint / build green
- [x] Route inventory diff clean, RSS/sitemap/canonical/OG verified
- [x] Desktop + mobile screenshots
- [ ] Deploy preview, then promote `v4` → `main` after approval

## Files & folders this feature touches

Created (this run):
- `docs/specs/2026-06-14--v4-astro-rebuild/plan.md`
- `docs/specs/2026-06-14--v4-astro-rebuild/route-inventory.md`
- `docs/specs/2026-06-14--v4-astro-rebuild/work-log.md`
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
