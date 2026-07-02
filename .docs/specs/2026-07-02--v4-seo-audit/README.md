# v4 SEO audit

Status: audit completed / implementation backlog ready
Owner: @hta218
Created: 2026-07-02
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

## Report

See `report.md` for detailed findings, evidence, and implementation-ready tasks.
