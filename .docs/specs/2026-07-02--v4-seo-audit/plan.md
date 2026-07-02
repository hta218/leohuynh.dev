# SEO audit implementation plan

Date: 2026-07-02
Spec: `.docs/specs/2026-07-02--v4-seo-audit/`

## Goal

Turn the SEO audit findings in `report.md` into safe, incremental fixes for `leohuynh.dev` v4.

## Constraints

- Work on branch `v4` unless instructed otherwise.
- Do not overwrite unrelated dirty work.
- Use Bun only; do not create npm/pnpm lockfiles.
- Keep production canonical host as `https://www.leohuynh.dev`.
- Keep `trailingSlash: 'never'` canonical behavior.
- Preserve current visible content titles unless a content edit is intentional.
- Prefer SEO-specific metadata fields over shortening display titles.

## Phase 1 — Sitemap/indexability cleanup

Files:

- `astro.config.mjs`
- `src/pages/topics/[tag].astro` only if changing the noindex policy
- optionally `src/pages/guestbook.astro`

Tasks:

1. Exclude `noindex` topic detail pages from `@astrojs/sitemap`.
2. Keep `/topics` itself indexable and in the sitemap.
3. Decide whether `/guestbook` should be indexable:
   - if no: pass `noindex` to `BaseLayout` and exclude it from sitemap.
   - if yes: keep it in sitemap and verify SSR content on Vercel preview.
4. Rebuild and verify `0` sitemap URLs render `noindex`.

Acceptance:

- `bun run build` passes.
- `dist/client/sitemap-0.xml` has no URL whose rendered HTML includes `noindex`.

## Phase 2 — Legacy tag feed redirects

Files:

- `vercel.json`
- `astro.config.mjs`

Tasks:

1. Add `/tags/:tag/feed.xml` → `/topics/:tag/feed.xml` in `vercel.json`.
2. Add the equivalent Astro redirect if supported.
3. Verify `/topics/javascript/feed.xml` still serves XML.
4. Verify the old feed URL redirects in Vercel preview or `vercel dev`.

Acceptance:

- `/tags/javascript/feed.xml` permanently redirects to `/topics/javascript/feed.xml`.
- `/topics/javascript/feed.xml` returns a valid RSS XML response.

## Phase 3 — SEO-specific metadata fields

Files:

- `src/content.config.ts`
- `src/pages/log/[...slug].astro`
- `src/pages/gists/[...slug].astro`
- `src/pages/misc/[...slug].astro`
- `scripts/check-seo-lengths.mjs`
- selected MDX files under `data/blog/`, `data/snippets/`, `data/misc/`

Tasks:

1. Add optional `seoTitle` and `seoDescription` schema fields.
2. Use `seoTitle ?? title/heading` for metadata title.
3. Use `seoDescription ?? summary` for meta description and OG/Twitter descriptions.
4. Update `scripts/check-seo-lengths.mjs` to check effective SEO metadata.
5. Add concise SEO fields to the worst offenders first.

Acceptance:

- `bun run seo:check` warnings are reduced or eliminated for priority pages.
- Visible H1/display titles remain unchanged unless intentionally edited.

## Phase 4 — Content/accessibility cleanup

Files:

- `data/blog/how-should-developers-looking-for-a-job-part-1.mdx`
- `src/pages/whoami.astro`

Tasks:

1. Add `alt` text to the three LinkedIn screenshots in the MDX file.
2. Update `/whoami` stack claims:
   - Astro 6, not Astro 5.
   - raw `postgres` client / no ORM, not Drizzle.
3. Run check/build.

Acceptance:

- Missing-alt scan returns `0` for source images.
- `/whoami` public copy matches the v4 stack.

## Phase 5 — Structured data enrichment

Files:

- `src/lib/seo.ts`
- `src/layouts/BaseLayout.astro`
- `src/pages/log/[...slug].astro`
- `src/pages/gists/[...slug].astro`
- `src/pages/misc/[...slug].astro`
- `src/pages/whoami.astro`

Tasks:

1. Add `keywords` and `inLanguage` support to `articleJsonLd`.
2. Pass tags/language from detail routes.
3. Add modified-time meta when `lastmod` exists.
4. Add `/whoami` `ProfilePage`/expanded `Person` JSON-LD.
5. Validate JSON-LD parse locally and with Google Rich Results Test on preview.

Acceptance:

- All JSON-LD scripts parse as valid JSON.
- Detail pages include richer schema without changing visible content.

## Final verification

Run:

- `bun run check`
- `bun run build`
- `bun run seo:check`
- Static rendered crawl for metadata/canonical/noindex/sitemap consistency
- Lighthouse SEO-only checks for:
  - `/`
  - `/log`
  - one article page
  - one translated misc page
  - one intentionally noindex topic page
- Vercel preview checks for SSR routes and redirects
