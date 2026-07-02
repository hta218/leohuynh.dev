# v4 SEO audit

Status: implemented (2026-07-02) — ready for re-audit
Owner: @hta218
Created: 2026-07-02
Last Updated: 2026-07-02
Branch: `v4`

## Original prompt

> Audit SEO at leohuynh.dev local on branch v4. Write a spec first, then write the audit report into that spec.

## Scope

This spec records a codebase-first and rendered-output SEO audit for the Astro v4 site.

Audit covered:

- Metadata and canonical tags
- Open Graph / Twitter metadata
- `robots.txt` and sitemap output
- Route redirects and old URL parity
- Indexability / `noindex`
- JSON-LD structured data
- Hreflang on translated misc pages
- Content frontmatter title/summary lengths
- Basic image `alt` coverage
- Local build/typecheck/Lighthouse SEO smoke checks

Out of scope:

- Search Console data
- Production crawl logs
- Backlink/keyword competitor research
- Full Core Web Vitals field data

## Summary

The v4 site has a solid SEO base: canonical tags, meta descriptions, OG/Twitter tags, RSS, `robots.txt`, sitemap generation, JSON-LD on content details, and hreflang for the current translated misc pair are all present. Local typecheck/build pass and Lighthouse SEO scores are 100 on representative indexable pages.

The main SEO issues are implementation hygiene rather than foundational blockers:

1. `145` thin `noindex` topic pages are still submitted in `sitemap-0.xml`.
2. Many post/snippet titles and descriptions exceed recommended SERP lengths.
3. Legacy tag feed redirects appear missing for `/tags/:tag/feed.xml`.
4. Three MDX content images are missing `alt` text.
5. Structured data is valid but can be richer for articles, profile/about, and AEO.
6. Some public content on `/whoami` is stale vs the v4 stack, which weakens trust/EEAT.

No source code fixes were made in this audit pass. The report and implementation backlog are in `report.md`.

## Verification commands run

- `git status --short --branch`
- `bun run check`
  - Result: `0 errors`, `0 warnings`, `0 hints`
- `bun run build`
  - Result: build completed successfully
  - Noted warning: local Node `26` is unsupported by Vercel Serverless Functions; Vercel will use Node `24`
- `bun run seo:check`
  - Result: `39` informational title/summary length warnings
- Static local crawl of `dist/client` via `python3 -m http.server 3434`
- Lighthouse SEO-only checks via `bunx lighthouse` against static local output

Representative Lighthouse SEO scores:

| Route | Score | Notes |
| --- | ---: | --- |
| `/` | 100 | no failing SEO audits |
| `/log` | 100 | no failing SEO audits |
| `/log/does-promise-all-run-in-parallel-or-sequential` | 100 | no failing SEO audits |
| `/misc/what-is-dropshipping` | 100 | no failing SEO audits |
| `/topics/443` | 66 | expected because the page is intentionally `noindex` |

## Files likely to change when implementing fixes

- `astro.config.mjs`
- `vercel.json`
- `src/content.config.ts`
- `src/layouts/BaseLayout.astro`
- `src/lib/seo.ts`
- `src/pages/log/[...slug].astro`
- `src/pages/gists/[...slug].astro`
- `src/pages/misc/[...slug].astro`
- `src/pages/whoami.astro`
- `scripts/check-seo-lengths.mjs`
- Selected MDX files in `data/blog/` and `data/snippets/`

## Implementation status (2026-07-02)

All findings from `report.md` have been addressed. Work landed on branch `v4`.
Please re-audit against the current build to confirm.

| # | Finding | Status | What changed |
| --- | --- | --- | --- |
| 1 | `noindex` topic pages in sitemap | ✅ Done | `astro.config.mjs` sitemap `filter` drops `/topics/<tag>` detail pages; `/topics` index stays. Verified: sitemap `241 → 71` URLs, `0` render `noindex`. |
| 2 | Long titles/descriptions | ⚠️ Infra only (by decision) | Added optional `seoTitle`/`seoDescription` schema fields + route rendering (`seoTitle ?? title`, `seoDescription ?? summary`) + updated `check-seo-lengths.mjs`. **Existing posts were intentionally NOT edited** — see decision below. New posts can opt in. `seo:check` still reports `39` (unchanged, expected). |
| 3 | Legacy tag feed redirects | ✅ Done | Added `/tags/:tag/feed.xml → /topics/:tag/feed.xml` (301) in both `vercel.json` and `astro.config.mjs` (ordered before `/tags/:tag`). |
| 4 | Missing image `alt` | ✅ Done | Added descriptive `alt` to the 3 LinkedIn screenshots in `how-should-developers-looking-for-a-job-part-1.mdx`. Source missing-alt scan → `0`. |
| 5 | Richer structured data | ✅ Done | `articleJsonLd` now emits `keywords` (tags) + `inLanguage`; `BaseLayout` emits `article:modified_time` when `lastmod` exists; `/whoami` emits `ProfilePage` + `Person` via new `profileJsonLd`. `headline` still uses the real on-page title. |
| 6 | Stale `/whoami` stack | ✅ Done | Updated to Astro 6 + React 19 islands and raw `postgres` client (removed Astro 5 / Drizzle). |
| 7 | Index policy for utility routes | ✅ Done (decision) | `/guestbook` → `noindex,follow` + excluded from sitemap (UGC, no search value). `/dotfiles` → kept indexable + in sitemap (useful config mirror). |

### Decisions worth noting for the re-audit

- **Finding 2 — deliberately infra-only.** The owner chose to keep the mechanism
  (`seoTitle`/`seoDescription`) for **new posts only** and NOT retrofit existing
  posts. Rationale: for pages already ranking well, changing `<title>` risks
  ranking/CTR and can drop keywords (e.g. the top-traffic
  `does-promise-all-run-in-parallel-or-sequential` post: shortening its title
  would have dropped "JavaScript" / "sequential"). Long titles are only
  truncated in display, still fully indexed — "if it ranks, don't touch the
  title". So `seo:check` warnings remaining is expected, not a regression.
- **Finding 7 — explicit owner decision** (guestbook noindex, dotfiles indexed).

### Verification run after implementation

- `bun run check` → `0 errors, 0 warnings, 0 hints`
- `bun run build` → success
- Parsed `dist/client/sitemap-0.xml` → `0` URLs render `noindex`; `/guestbook`
  excluded; `/dotfiles` present; `/topics` index present, `/topics/<tag>` absent.
- Confirmed in built HTML: article JSON-LD carries `keywords` + `inLanguage`,
  `article:modified_time` present, `/whoami` has `ProfilePage`.

Note: `/guestbook` is SSR (`prerender = false`), so its `noindex` meta renders
at request time (not in static `dist/client`) — confirm on a Vercel preview.

## Report

See `report.md` for detailed findings, evidence, and implementation-ready tasks.
