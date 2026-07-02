# SEO audit report — leohuynh.dev v4

Date: 2026-07-02
Branch: `v4`
Repo: `/Users/hta218/Documents/personal/code/leohuynh.dev`

## Executive summary

The v4 Astro site is already in good shape for technical SEO:

- Canonical tags are present on all built HTML pages checked.
- Meta descriptions are present on all built HTML pages checked.
- Open Graph and Twitter card metadata are centralized in `BaseLayout.astro`.
- `robots.txt` allows crawling and points to `https://www.leohuynh.dev/sitemap-index.xml`.
- JSON-LD exists on the homepage and content detail pages.
- Hreflang is present and reciprocal for the current English/Vietnamese misc translation pair.
- `bun run check` and `bun run build` pass.
- Lighthouse SEO scores are 100 for representative indexable pages.

Highest-priority work:

1. Remove `noindex` topic pages from the sitemap.
2. Add SEO-specific title/description fields and clean long metadata.
3. Add missing legacy tag-feed redirects.
4. Add missing image alt text.
5. Enrich structured data and update stale public stack claims.

## Current evidence snapshot

### Commands

`bun run check`

Result:

- `0 errors`
- `0 warnings`
- `0 hints`

`bun run build`

Result:

- Build completed successfully.
- Generated `sitemap-index.xml` and `sitemap-0.xml`.
- Warning: local Node `26` is unsupported by Vercel Serverless Functions; Vercel will use Node `24`.

`bun run seo:check`

Result:

- `39` informational fields over recommended title/summary length.

Static rendered-output crawl of `dist/client`:

- HTML files checked: `240`
- Missing title/description/canonical basics: `0`
- H1 count issues: `0`
- JSON-LD parse errors: `0`
- Pages with JSON-LD: `226`
- JSON-LD scripts total: `282`
- Static `noindex` pages: `146` (`145` thin topic pages + 404)
- Sitemap URLs total: `241`
- Sitemap URLs that are also `noindex`: `145`

Representative rendered metadata:

| Route | Title length | Description length | Canonical | Robots | JSON-LD |
| --- | ---: | ---: | --- | --- | --- |
| `/` | 45 | 134 | `https://www.leohuynh.dev/` | indexable | `WebSite`, `Person` |
| `/log` | 15 | 75 | `https://www.leohuynh.dev/log` | indexable | none |
| `/log/does-promise-all-run-in-parallel-or-sequential` | 72 | 207 | matching `/log/...` | indexable | `BlogPosting`, `BreadcrumbList` |
| `/gists/vscode-settings` | 50 | 95 | matching `/gists/...` | indexable | `BlogPosting`, `BreadcrumbList` |
| `/topics/javascript` | 23 | 71 | matching `/topics/...` | indexable | `BreadcrumbList` |
| `/topics/443` | 16 | 64 | matching `/topics/...` | `noindex,follow` | `BreadcrumbList` |
| `/misc/what-is-dropshipping` | 33 | 98 | matching `/misc/...` | indexable | `BlogPosting`, `BreadcrumbList` |
| `/misc/dropshipping-la-gi` | 31 | 58 | matching `/misc/...` | indexable | `BlogPosting`, `BreadcrumbList` |

Browser-rendered spot check on `/log/does-promise-all-run-in-parallel-or-sequential`:

- `document.title`: `Does JavaScript Promise.all() run in parallel or sequential? — Leo Huynh`
- canonical: `https://www.leohuynh.dev/log/does-promise-all-run-in-parallel-or-sequential`
- description present
- H1 count: `1`
- JSON-LD: `BlogPosting`, `BreadcrumbList`
- Browser console errors: `0`

---

## Finding 1 — `noindex` topic pages are submitted in sitemap

Severity: High

### Issue

Thin topic pages are intentionally marked `noindex`, but they are still emitted into `sitemap-0.xml`.

### Evidence

`src/pages/topics/[tag].astro`:

- `posts.length + snippets.length <= 1` is considered thin.
- Thin pages render `<meta name="robots" content="noindex,follow">` through `BaseLayout`.

Rendered sitemap/build crawl:

- `sitemap-0.xml` contains `241` URLs.
- `145` sitemap URLs are rendered as `noindex` topic pages.
- Examples:
  - `/topics/443`
  - `/topics/alias`
  - `/topics/api`
  - `/topics/csv-parser`
  - `/topics/git-workflows`

### Impact

This sends mixed signals: “please crawl/index this URL” from the sitemap and “do not index this URL” from the page. It will likely create Google Search Console noise such as “Submitted URL marked noindex” and wastes sitemap quality on intentionally low-value pages.

### Recommended fix

Exclude thin topic detail pages from the sitemap.

Lowest-risk implementation:

- Keep thin topic pages browsable in-app.
- Keep `noindex,follow` on thin pages.
- Exclude all `/topics/<tag>` detail pages from `@astrojs/sitemap`, or only include topic pages above the same count threshold.

Simple option:

- In `astro.config.mjs`, add a sitemap `filter` that excludes tag detail pages:
  - keep `/topics`
  - exclude `https://www.leohuynh.dev/topics/<tag>`
  - feed endpoints are not currently in the sitemap, so no change needed there

More precise option:

- Add a shared helper/script that computes topic counts at build time.
- Use the same threshold for:
  - `src/pages/topics/[tag].astro` `noindex`
  - sitemap inclusion/exclusion

### Implementation tasks

1. Update `astro.config.mjs` sitemap config.
2. Rebuild with `bun run build`.
3. Parse `dist/client/sitemap-0.xml` and verify no URL in the sitemap renders `noindex`.
4. Keep `/topics` index page in the sitemap.
5. Confirm `/topics/<tag>` pages still render and are linked internally.

### Acceptance criteria

- `sitemap-0.xml` contains `0` URLs that render `<meta name="robots" content="noindex,follow">`.
- `/topics/443` still renders and has `noindex,follow`.
- `/topics` remains indexable and present in the sitemap.
- `bun run build` passes.

---

## Finding 2 — Many content titles/descriptions exceed SERP length guidelines

Severity: Medium

### Issue

Many blog/snippet metadata fields are longer than recommended SERP display lengths.

### Evidence

`bun run seo:check` reported:

- `39` informational warnings.

Rendered static crawl reported:

- `36` document titles over 60 characters.
- `17` meta descriptions over 160 characters.

Examples:

| File / route | Problem |
| --- | --- |
| `/log/how-should-developers-looking-for-a-job-part-2` | title length `109` |
| `/log/render-blocking-css-and-chrome-performance-api` | title length `98` |
| `/log/does-promise-all-run-in-parallel-or-sequential` | title length `72`, description length `207` |
| `/log/integrate-tailwind-css-with-react-application` | description length `300` |
| `/log/dev-setup-minimal-list-for-web-dev-on-a-fresh-macos-install` | description length `264` |
| `/gists/connecting-to-github-using-ssh` | title length `83`, description length `167` |
| `/gists/parse-function-from-string` | title length `84`, description length `163` |

### Impact

Google may truncate or rewrite titles/descriptions. Long display titles can still be useful on-page, but SEO metadata should be tighter and search-intent oriented.

### Recommended fix

Do not force display titles/summaries to be short. Add optional SEO-specific fields:

- `seoTitle`
- `seoDescription`

Then route rendering should prefer:

- title: `seoTitle ?? title/heading`
- description: `seoDescription ?? summary`

This preserves expressive on-page content while making SERP metadata concise.

### Implementation tasks

1. Extend `src/content.config.ts` schemas:
   - Add `seoTitle?: string`.
   - Add `seoDescription?: string`.
2. Update detail routes:
   - `src/pages/log/[...slug].astro`
   - `src/pages/gists/[...slug].astro`
   - `src/pages/misc/[...slug].astro`
3. Update JSON-LD generation to use SEO description when available, but keep `headline` as the real content title unless `seoTitle` is explicitly preferred.
4. Update `scripts/check-seo-lengths.mjs` to check the effective rendered SEO fields.
5. Add `seoTitle`/`seoDescription` to the worst offenders first.
6. Decide whether `bun run seo:check` should remain informational or become CI-failing after cleanup.

### Acceptance criteria

- `bun run seo:check` reports no warnings for updated priority content.
- Representative high-value pages have titles around 50–60 characters and descriptions around 140–160 characters.
- On-page H1/display titles remain unchanged unless intentionally edited.
- `bun run check` and `bun run build` pass.

---

## Finding 3 — Legacy tag feed redirects appear missing

Severity: Medium

### Issue

The v4 route migration redirects old tag pages to new topic pages, but old tag feed URLs are not explicitly redirected.

### Evidence

Current new route:

- `src/pages/topics/[tag]/feed.xml.ts`

Existing redirects:

- `vercel.json`
  - `/tags` → `/topics`
  - `/tags/:tag` → `/topics/:tag`
- `astro.config.mjs`
  - `/tags` → `/topics`
  - `/tags/[tag]` → `/topics/[tag]`

Missing likely legacy redirect:

- `/tags/:tag/feed.xml` → `/topics/:tag/feed.xml`

### Impact

Old RSS subscribers, crawlers, or links using tag feed URLs can hit 404 after cutover.

### Recommended fix

Add explicit legacy feed redirects in both redirect systems used by this repo.

### Implementation tasks

1. In `vercel.json`, add:
   - source: `/tags/:tag/feed.xml`
   - destination: `/topics/:tag/feed.xml`
   - permanent: `true`
2. In `astro.config.mjs`, add the equivalent Astro redirect if supported by the current syntax:
   - `/tags/[tag]/feed.xml` → `/topics/[tag]/feed.xml`
3. Rebuild and smoke check expected redirects in Vercel preview or `vercel dev` if available.

### Acceptance criteria

- `/tags/javascript/feed.xml` returns a permanent redirect to `/topics/javascript/feed.xml` in the Vercel preview/deployment.
- `/topics/javascript/feed.xml` returns XML successfully.
- Existing `/tags/javascript` redirect still works.

---

## Finding 4 — Three MDX images are missing `alt` text

Severity: Medium/Low

### Issue

Three inline MDX images lack `alt` attributes.

### Evidence

Missing `alt` scan found `3` images, all in:

- `data/blog/how-should-developers-looking-for-a-job-part-1.mdx`
  - line 106: `/static/images/linkedin3.png`
  - line 110: `/static/images/linkedin4.png`
  - line 114: `/static/images/linkedin5.jpg`

### Impact

Image accessibility is reduced. Image SEO and rich understanding of the article are also weaker.

### Recommended fix

Add descriptive `alt` text if the images are content-bearing. Use `alt=""` only if they are purely decorative.

### Implementation tasks

1. Open `data/blog/how-should-developers-looking-for-a-job-part-1.mdx`.
2. Add `alt` text to the three LinkedIn profile screenshots.
3. Run the missing-alt scan again or add it to a script later.
4. Run `bun run check` and `bun run build`.

### Acceptance criteria

- Missing `<img>` `alt` scan returns `0` for source files.
- The article still renders correctly.

---

## Finding 5 — Structured data is valid but can be richer

Severity: Low/Medium

### Issue

Current JSON-LD is valid and present, but it omits some useful fields for article discovery, EEAT, and AEO.

### Evidence

Current implementation:

- `src/lib/seo.ts`
  - `breadcrumbJsonLd`
  - `articleJsonLd`
  - `siteJsonLd`
- Homepage emits `WebSite` + `Person`.
- Blog/gist/misc detail pages emit `BlogPosting` + `BreadcrumbList`.
- JSON-LD parse errors: `0`.

Opportunity gaps:

- `BlogPosting` does not include `keywords` from tags.
- `BlogPosting` does not include `inLanguage`.
- Pages with `lastmod` do not emit `article:modified_time` meta, only JSON-LD `dateModified`.
- `/whoami` does not emit `ProfilePage`/expanded `Person` schema.
- `WebSite` does not include `SearchAction`; only add this if site search is intended to be a meaningful public feature.

### Impact

Search engines and AI answer systems can still understand the pages, but richer schema can improve entity understanding, article freshness signals, and extractability.

### Recommended fix

Enhance existing schema functions rather than adding a parallel schema system.

### Implementation tasks

1. Extend `articleJsonLd` in `src/lib/seo.ts`:
   - `keywords?: string[]`
   - `inLanguage?: string`
2. Pass tags/language from:
   - `src/pages/log/[...slug].astro`
   - `src/pages/gists/[...slug].astro`
   - `src/pages/misc/[...slug].astro`
3. Add `article:modified_time` support in `BaseLayout.astro` or route head slots when `lastmod` exists.
4. Add a `profileJsonLd` helper and emit it on `/whoami`.
5. Validate rendered JSON-LD with local JSON parse first, then Google Rich Results Test on a deployed preview.

### Acceptance criteria

- Blog/gist/misc JSON-LD remains valid JSON.
- Blog/gist pages include tags as `keywords`.
- Misc pages include correct `inLanguage` (`en` or `vi`).
- `/whoami` emits a valid `ProfilePage` or expanded `Person` JSON-LD.
- Browser console has no JSON-LD errors.

---

## Finding 6 — `/whoami` public content has stale stack claims

Severity: Low/Medium

### Issue

The `/whoami` page contains public-facing stack text that appears stale relative to the v4 repo guidance.

### Evidence

`AGENTS.md` says:

- Astro 6
- React 19 islands
- raw `postgres` client
- no ORM; Drizzle is gone

`src/pages/whoami.astro` says:

- `Astro 5 static-first + React islands for live widgets.`
- `Supabase Postgres + Drizzle for stats and lists.`

### Impact

This is not a technical indexing blocker, but it weakens content trust/EEAT because public claims are outdated.

### Recommended fix

Update `/whoami` copy to match the current v4 stack.

### Implementation tasks

1. Edit `src/pages/whoami.astro` feature list:
   - Astro 6
   - React 19 islands
   - Supabase Postgres + raw `postgres` client for stats/reactions
2. Review the surrounding copy for Next.js/Remix references and decide whether they describe personal skills or current stack.
3. Run `bun run check` and `bun run build`.

### Acceptance criteria

- `/whoami` no longer says Astro 5 or Drizzle for the current site stack.
- Page still renders with one H1 and valid metadata.

---

## Finding 7 — Decide indexability policy for dynamic/UGC utility routes

Severity: Low / decision needed

### Issue

The generated sitemap includes dynamic routes that are not present in static `dist/client` output:

- `/dotfiles`
- `/guestbook`

This is expected for SSR/dynamic routes, but their SEO policy should be explicit.

### Evidence

Sitemap includes:

- `https://www.leohuynh.dev/dotfiles`
- `https://www.leohuynh.dev/guestbook`

Static crawl could not verify them from `dist/client` because they are dynamic/Vercel-served routes.

### Impact

- `/dotfiles` can be useful SEO content if GitHub-backed rendering is reliable.
- `/guestbook` is UGC and may be low-value/noisy. If public indexing is not a goal, it should be `noindex` and removed from sitemap.

### Recommended fix

Make an explicit decision:

- Keep `/dotfiles` indexable if it is intended as a public, crawlable config mirror.
- For `/guestbook`, either:
  - make it indexable intentionally and ensure SSR always returns useful content, or
  - mark it `noindex,follow` and exclude it from sitemap.

### Implementation tasks

1. Decide desired policy for `/guestbook`.
2. If `noindex`, pass `noindex` to `BaseLayout` in `src/pages/guestbook.astro`.
3. Exclude `/guestbook` from sitemap filter.
4. Verify on a Vercel preview, not only static `dist/client`.

### Acceptance criteria

- Sitemap contains only URLs intended for indexing.
- Dynamic routes have verified production/preview status and metadata.

---

## Positive checks to preserve

Do not regress these while implementing fixes:

- `public/robots.txt`:
  - allows crawling
  - points to `https://www.leohuynh.dev/sitemap-index.xml`
- `astro.config.mjs`:
  - `site: 'https://www.leohuynh.dev'`
  - `trailingSlash: 'never'`
  - legacy route redirects exist for major section renames
- `BaseLayout.astro`:
  - one canonical tag per page
  - OG/Twitter metadata centralized
  - `noindex` opt-in supported
- Draft content filtering:
  - `data/snippets/useful-array-utilities.mdx` has `draft: true`
  - it is not emitted as `/gists/useful-array-utilities`
- Hreflang on misc translation pair:
  - `/misc/what-is-dropshipping`
  - `/misc/dropshipping-la-gi`
  - includes `en`, `vi`, and `x-default`
  - reciprocal links are present

## Suggested implementation order

1. Sitemap/indexability cleanup
   - Fix `noindex` topics in sitemap.
   - Decide `/guestbook` policy.
2. Redirect parity
   - Add `/tags/:tag/feed.xml` legacy redirect.
3. Metadata model
   - Add `seoTitle`/`seoDescription` fields.
   - Clean highest-value posts first.
4. Content/accessibility cleanup
   - Add missing image alt text.
   - Update stale `/whoami` stack claims.
5. Structured data enrichment
   - Add `keywords`, `inLanguage`, modified-time meta, and `/whoami` profile schema.
6. Verification pass
   - `bun run check`
   - `bun run build`
   - `bun run seo:check`
   - static rendered crawl
   - Lighthouse SEO on representative pages
   - Vercel preview checks for redirects and SSR routes

## Handoff prompt for implementation agent

Read `.docs/specs/2026-07-02--v4-seo-audit/README.md` and `report.md` first.

Goal: implement the v4 SEO audit backlog without changing unrelated functionality.

Constraints:

- Work on branch `v4` unless instructed otherwise.
- Do not overwrite existing dirty work unrelated to SEO.
- Use Bun only; do not create npm/pnpm lockfiles.
- Preserve existing URL/canonical strategy: production canonical host is `https://www.leohuynh.dev`, no trailing slash.
- Keep thin topic pages browsable, but do not submit `noindex` pages in sitemap.
- Prefer adding `seoTitle`/`seoDescription` over shortening visible titles/summaries.
- Keep JSON-LD valid and parseable.

Verification required before completion:

- `bun run check`
- `bun run build`
- `bun run seo:check`
- Parse `dist/client/sitemap-0.xml` and confirm `0` sitemap URLs render `noindex`.
- Run Lighthouse SEO on `/`, `/log`, one article page, one misc translated page, and one intentionally noindex topic page.
- Verify tag-feed redirect on Vercel preview or `vercel dev` if available.
