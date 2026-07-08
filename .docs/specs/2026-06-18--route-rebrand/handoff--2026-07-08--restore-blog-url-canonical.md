# Handoff — Restore canonical blog URL pattern

Date: 2026-07-08
Owner: @hta218
Repo: `/Users/hta218/Documents/personal/code/leohuynh.dev`
Branch: `main`
Base commit at handoff time: `5f54996`

## Goal

Restore blog content URLs back to the legacy/canonical `/blog` pattern for SEO stability, while keeping the developer-flavored UI labels where desired.

Canonical blog routes must be:

- Blog index: `/blog`
- Blog detail: `/blog/:slug`
- Blog pagination: `/blog/page/:page` for page 2+
- Page 1 canonical: `/blog` only; `/blog/page/1` should redirect to `/blog`

The old v4-only `/log` routes must redirect permanently to `/blog` equivalents.

## Product decision

Keep the left sidebar/explorer vibe label as `logs` / `Logs` if desired. Only the public URL pattern must change back to `/blog`.

So this is OK:

- Sidebar folder text: `logs`
- Page title/nav label: `Log`
- Internal route href/canonical/sitemap/RSS/search URL: `/blog...`

## Current state found locally

The current implementation routes blog content through `/log`:

- `src/pages/log/index.astro`
- `src/pages/log/[...slug].astro`
- `src/pages/log/page/[page].astro`
- `src/components/PostList.astro` links to `/log/${post.id}` and pagination uses `/log/page/${n}`
- `src/pages/index.astro` latest writing links to `/log/${post.id}`
- `src/pages/topics/[tag].astro` links blog entries to `/log/${post.id}`
- `src/pages/feed.xml.ts` emits blog RSS links as `/log/${p.id}`
- `src/pages/topics/[tag]/feed.xml.ts` emits blog links as `/log/${p.id}`
- `src/pages/log/[...slug].astro` builds canonical/JSON-LD/Breadcrumb around `/log/${post.id}`
- `src/components/studio/studio-shell/lib/explorer-tree.ts` uses `/log` hrefs and active matchers while showing `logs` label
- `src/components/studio/studio-shell/lib/tabs.ts` resolves `/log` tabs
- `src/lib/site.ts` `NAV_LINKS` uses `{ href: '/log', title: 'Log' }`
- `astro.config.mjs` and `vercel.json` redirect `/blog*` to `/log*`
- `search.json.ts` already emits `/blog/:id`; keep/fix as canonical `/blog`

Existing content files in `data/blog/*.mdx` already contain legacy internal links such as `/blog/...`; these should become direct links again, not redirects.

## Implementation requirements

### 1. Restore route files

Prefer `git mv` so history remains readable:

- Move `src/pages/log/index.astro` → `src/pages/blog/index.astro`
- Move `src/pages/log/[...slug].astro` → `src/pages/blog/[...slug].astro`
- Move `src/pages/log/page/[page].astro` → `src/pages/blog/page/[page].astro`

Remove the `/log` page routes after the redirect config is in place. Do not keep duplicate rendered pages at both `/log` and `/blog`; `/blog` is canonical, `/log` is redirect-only.

### 2. Update canonical/internal URLs

Update all blog route strings from `/log` to `/blog` where they represent public URLs:

- `src/pages/blog/[...slug].astro`
  - canonical fallback: `new URL(`/blog/${post.id}`, SITE.siteUrl).href`
  - breadcrumb: `{ name: 'Log', url: `${SITE.siteUrl}/blog` }` is acceptable; label can remain `Log`
  - `StudioShell active` should use `/blog/${post.id}`
  - crumb may remain dev-flavored if desired, but avoid suggesting an actual `/log` URL if it is clearly a route crumb
- `src/pages/blog/index.astro`
  - route exists at `/blog`
  - title can remain `Log`
  - `StudioShell active` should use `/blog`
- `src/pages/blog/page/[page].astro`
  - route exists at `/blog/page/:page`
  - page 1 remains omitted from static paths
  - `StudioShell active` should use `/blog`
- `src/components/PostList.astro`
  - post hrefs `/blog/${post.id}`
  - pagination: page 1 `/blog`, pages 2+ `/blog/page/${n}`
- `src/pages/index.astro`
  - latest writing links `/blog/${post.id}`
- `src/pages/topics/[tag].astro`
  - post links `/blog/${post.id}`
- `src/pages/feed.xml.ts`
  - blog item links `/blog/${p.id}`
- `src/pages/topics/[tag]/feed.xml.ts`
  - blog item links `/blog/${p.id}`
- `src/lib/site.ts`
  - `NAV_LINKS` blog/log entry should have `href: '/blog'`; title may stay `Log`
- `src/pages/404.astro`
  - “open blog” should href `/blog`
- `src/components/studio/studio-shell/lib/explorer-tree.ts`
  - visible folder `file: 'logs'`, `title: 'Logs'` may stay
  - hrefs/activeWhen should match `/blog`
  - `postsIndex.href = '/blog'`
  - `postsSlug.href = latestPostId ? `/blog/${latestPostId}` : '/blog'`
  - activeWhen uses `/blog` and `/blog/page/`
- `src/components/studio/studio-shell/lib/tabs.ts`
  - resolve `/blog`, `/blog/page/*`, `/blog/:slug`
  - tab label/file can be `blog/index.astro` or remain visually `log/index.astro`; prefer `blog/index.astro` because route file is now under `src/pages/blog`
- `src/pages/search.json.ts`
  - keep blog document URL as `/blog/${entry.id}`; verify no regression

Avoid changing `StatsType = 'blog'`; that is a data/content type, not URL prefix.

### 3. Update redirects

Update both `astro.config.mjs` and `vercel.json`.

Remove the current `/blog -> /log` redirects.

Add/keep these canonicalization redirects:

- `/log` → `/blog`
- `/log/page/1` → `/blog`
- `/blog/page/1` → `/blog`
- `/log/page/[page]` → `/blog/page/[page]` in `astro.config.mjs`
- `/log/[...slug]` → `/blog/[...slug]` in `astro.config.mjs`
- `/log/page/:page` → `/blog/page/:page` in `vercel.json`
- `/log/:slug*` → `/blog/:slug*` in `vercel.json`

Update special legacy redirect:

- `/snippets/crawling-goodreads-books-data` → `/blog/crawling-goodreads-books-data`

Keep unrelated route-rebrand redirects unchanged:

- `/about` → `/whoami`
- `/snippets*` → `/gists*`
- `/projects` → `/builds`
- `/books`, `/movies` → `/shelf`
- `/tags*` → `/topics*`

### 4. Stale text cleanup

Search for stale `/log` public URL references after implementation:

```bash
rg "/log|`/log|\"/log|'\/log" src astro.config.mjs vercel.json .docs/specs/2026-06-18--route-rebrand
```

Expected allowed leftovers only if they are redirect sources or historical work-log/spec notes. In app source, `/log` should not remain as a public blog link/canonical/active route except redirect config if unavoidable.

Do not rewrite unrelated words like `BuildLog`, movie title `Logan`, or generic “log” text.

### 5. Verification

Run these commands:

```bash
bun run check
bun run build
```

Then verify built output and generated URLs:

- `dist/client/blog/index.html` exists
- Representative detail HTML exists for e.g. `dist/client/blog/does-promise-all-run-in-parallel-or-sequential/index.html` or equivalent generated path
- `dist/client/sitemap-0.xml` contains `/blog` and `/blog/:slug` URLs
- `dist/client/sitemap-0.xml` does not contain `/log` URLs
- rendered canonical for a representative post is `https://www.leohuynh.dev/blog/<slug>`
- main RSS `/feed.xml` emits blog links under `/blog/`
- `/search.json` emits blog documents under `/blog/`

If practical, run local preview and smoke test:

```bash
bun run preview -- --host 127.0.0.1 --port 4343
```

Smoke routes:

- `GET /blog` → 200
- `GET /blog/does-promise-all-run-in-parallel-or-sequential` → 200
- `GET /blog/page/2` → 200, if enough posts
- `GET /log` → permanent redirect to `/blog`
- `GET /log/does-promise-all-run-in-parallel-or-sequential` → permanent redirect to `/blog/does-promise-all-run-in-parallel-or-sequential`
- `GET /log/page/2` → permanent redirect to `/blog/page/2`
- `GET /blog/page/1` → permanent redirect to `/blog`

Note: plain `astro preview` may not emulate all Vercel redirects. If redirect behavior cannot be verified locally, verify source config and generated static routes, then say redirect runtime needs Vercel deployment smoke.

## Acceptance criteria

- `/blog` is the canonical blog index URL.
- `/blog/:slug` is the canonical blog detail URL.
- `/blog/page/:page` is the canonical pagination URL for page 2+.
- `/log*` no longer renders duplicate content; it redirects permanently to `/blog*`.
- Sitemap, canonical tags, Open Graph URLs, JSON-LD, RSS, search JSON, nav links, topic links, home latest links all use `/blog*`.
- Sidebar folder label can remain `logs` / `Logs`.
- `bun run check` and `bun run build` pass.
- Do not commit or push; Hermes will verify first.
