# Plan: client navigation performance optimization

## Goal

Make first client-side navigation from the left sidebar feel responsive, especially for heavy routes, without removing site features or weakening SEO.

The plan is intentionally split into P0-P2. P0 should be low-risk UX + prefetch work. P1 removes true server/data blockers. P2 reduces large static payloads.

## Principles

- Keep current route URLs and canonical behavior unchanged.
- Do not introduce new external services.
- Do not expose server-only secrets to the browser.
- Prefer progressive enhancement: the route should still render without JS where possible.
- Distinguish route HTML blocking from post-swap widget/API work.
- Verify with both source checks and real browser/curl measurements.

## P0 — Navigation responsiveness and targeted prefetch

### P0.1 Add shell navigation pending state

Files likely to change:

- `src/components/studio/StudioShell.astro`
- `src/components/studio/studio-shell/client/boot.ts`
- possibly `src/components/studio/studio-shell/client/interactions.ts`
- `src/styles/global.css` or a small shell-specific style block/module if present

Implementation outline:

1. Add a subtle progress indicator to the persistent shell, for example:
   - top 2px bar under the tab bar; or
   - content dim/overlay with `loading…`; or
   - status bar text update.
2. In shell client boot, add a one-time document listener:
   - set `document.documentElement.dataset.navPending = 'true'` on `astro:before-preparation`.
   - clear on `astro:after-swap`, `astro:page-load`, and `astro:page-load` fallback.
   - add a timeout fallback to clear after e.g. 12s to avoid stuck state on errors.
3. Respect reduced motion for any animation.
4. Keep it shell-scoped and not intrusive.

Acceptance criteria:

- Clicking a slow route visibly acknowledges the click immediately.
- Pending state clears after successful navigation.
- Pending state does not flash excessively on fast routes.
- No console errors during route transitions.

Verification:

- `bun run check`
- `bun run build`
- Local dev server browser smoke:
  - click `/guestbook`, `/shelf`, `/heatmap`, `/builds` from left nav.
  - confirm pending state appears before swap and clears after swap.
  - confirm no console errors.

### P0.2 Add targeted prefetch to heavy left-nav links

Files likely to change:

- `src/components/studio/studio-shell/Sidebar.astro`
- possibly `src/components/studio/DotfilesNav.astro`
- maybe helper in `src/components/studio/studio-shell/lib/explorer-tree.ts`

Target internal routes:

- `viewport` prefetch:
  - `/shelf`
  - `/heatmap`
  - `/builds`
  - `/topics`
  - `/uses`
- `hover` or `tap` only:
  - `/guestbook` — never `viewport` while the document request still runs a Supabase-backed server render. In a persistent visible sidebar, `viewport` behaves like eager prefetch on every page load/swap.
  - `/llms` — avoid `viewport` until the cache-miss path no longer depends on a private GitHub fetch.
  - `/dotfiles` tree/file links — avoid `viewport` to prevent fan-out to GitHub-backed SSR.

Implementation outline:

1. Add a small function or field to classify heavy internal routes.
2. Render `data-astro-prefetch="viewport"` for heavy static/warm-cached route links.
3. Render `data-astro-prefetch="hover"` or `"tap"` for `/guestbook` and `/llms`; do not use `viewport` for these until P1 removes their server/data blocker.
4. Render `data-astro-prefetch="false"` for external stats and potentially noisy GitHub-backed dotfiles child links.

Acceptance criteria:

- Heavy internal sidebar links get explicit prefetch strategy.
- External links do not get internal prefetch attributes.
- Dotfiles do not accidentally prefetch the whole repo tree/file list.

Verification:

- Inspect rendered sidebar DOM in browser.
- Network panel: hover/viewport should prefetch selected route documents only; `/guestbook`, `/llms`, and `/dotfiles/*` must not prefetch simply because they are visible in the sidebar.
- Confirm whether visible left-nav links trigger `viewport` prefetch immediately after each page load/swap. If yes, budget `viewport` as effectively eager prefetch even for static heavy routes, and keep the target list narrow.
- `bun run check`, `bun run build`.

## P1 — Remove true server/data blockers

### P1.1 Guestbook should not block first route paint

Current problem:

- `src/pages/guestbook.astro` is `prerender = false` and server-renders first entries by awaiting `getGuestbookEntries()`.
- Anonymous first navigation waits on Supabase + serverless execution.

Preferred solution:

1. Keep `/guestbook` SSR only if needed for auth/session detection, but do not block first visual content on the entries query.
2. Render the page shell, header, and `GuestbookWall` skeleton immediately.
3. Reuse the existing read API route for entries:
   - `GET /api/guestbook?cursor=...&limit=...` in `src/pages/api/guestbook/index.ts`.
4. Let `GuestbookWall` load initial entries client-side after mount.
5. Preserve admin/current-user behavior:
   - current user/session can still be passed from server if cheap (cookie decode only).
   - entry list can include admin-only data only when authenticated/admin request hits the API.
6. Add explicit API caching for anonymous approved entries only if it is implemented as a separate safe response branch:
   - `public, s-maxage=30-60, stale-while-revalidate=300-600` is allowed only when `viewer` is absent and `isAdmin === false`.
   - authenticated/admin responses must stay `no-store` and must never share a CDN cache entry with anonymous responses.
   - because `toEntryDTO()` includes `status`, never cache admin responses publicly; pending/hidden/moderation data must not leak to anonymous users.

Alternative solution:

- Keep SSR entries for SEO but cache anonymous HTML with `s-maxage`. This is less ideal because guestbook is `noindex`, UGC, and interactivity matters more than SSR content.

Acceptance criteria:

- `/guestbook` document TTFB no longer depends on the entries query for anonymous users.
- Wall shows loading/skeleton and then entries.
- Sign-in/admin flows still work.
- No secrets/session data exposed to the client beyond existing user DTO.

Verification:

- Browser route transition from another page to `/guestbook` shows shell quickly.
- API returns expected entries.
- Authenticated/admin behavior manually smoke tested if credentials are available; otherwise document blocker.
- Anonymous and admin/API responses are verified to use different cache-control behavior; no admin response may be publicly cached.
- `bun run check`, `bun run build`.

### P1.2 Dotfiles: avoid GitHub-backed cold fetch in every shell render

Current problem:

- `StudioShell.astro` awaits `getDotfilesTree()` for every page render.
- For static pages this is build-time only.
- For SSR routes it may run during request on cold serverless instances.
- `dotfiles/[...slug].astro` fetches GitHub contents for file routes.
- The existing module-level memoization only helps warm serverless instance reuse; it does not remove the cold-start GitHub API dependency.

Preferred solution options:

Option A — build-time/static snapshot for tree:

1. Add a generated or checked-in dotfiles tree snapshot under `json/dotfiles-tree.json` or similar.
2. Use the snapshot for sidebar rendering.
3. Keep live GitHub fetch only for individual dotfile file content pages if necessary.
4. Add a maintenance script to refresh snapshot manually.

Option B — dedicated cached API/static data:

1. Move tree loading to a client/API path with aggressive CDN cache.
2. Render a minimal fallback tree in the initial HTML.
3. Hydrate/expand real tree after page load.

Recommended first choice: Option A. The tree changes rarely and a snapshot removes a request-time dependency from all SSR page shells.

Acceptance criteria:

- `StudioShell` no longer awaits live GitHub tree fetch on SSR requests.
- Dotfiles tree remains visible in the sidebar.
- If live dotfile content is slow, pending state covers it and CDN cache mitigates repeat hits.

Verification:

- Inspect source to confirm `StudioShell` tree path is static/snapshot.
- Cold `/guestbook` and `/llms` do not call GitHub tree as part of shell render.
- Browser sidebar still renders dotfiles group.

### P1.3 LLM token burn route resilience

Current problem:

- `/llms` is SSR and fetches a private summary through GitHub.
- Warm cache is fine; miss/cold still depends on GitHub.

Recommended solution:

- Keep current route for now if user does not see it as a problem.
- If optimizing, render static/cheap shell and fetch full token burn data client-side from `/api/token-burn.json`, with cache headers on the API.
- Or keep SSR but confirm `s-maxage=600` is respected as intended by Vercel. Current observed header is `cache-control: public`, with HIT/age, but the exact `s-maxage` directive is not visible in the final response.

Acceptance criteria if implemented:

- Cache-miss route navigation does not visibly block for GitHub fetch.
- Token data still appears after load.
- No private source URL/token leaks.

## P2 — Reduce static payload blockers

### P2.1 Heatmap: remove huge inlined SVG/data from document

Current problem:

- `/heatmap` HTML is ~497.6 KB.
- Source inlines projected SVG paths built from GeoJSON.

Solution options:

Option A — static SVG asset:

1. Generate `/static/generated/vietnam-heatmap.svg` or similar during build/maintenance.
2. Page initially renders an `<img>` or lightweight object/inline shell.
3. Interactive details can be loaded in a client island using compact JSON.

Option B — static JSON + client island:

1. Move projected province path data to a static JSON asset.
2. Initial page loads header/stats/list quickly.
3. `VietnamMap` island fetches geometry JSON on visible/idle and renders map client-side.

Recommended first choice: Option A if map interactivity is not required for all features; Option B if hover/click interactions must remain rich.

Acceptance criteria:

- `/heatmap` HTML size reduced substantially, target under ~220 KB.
- Map still renders correctly.
- Province hover/click behavior still works if currently supported.

Verification:

- `curl` HTML size before/after.
- Browser visual check of `/heatmap`.
- Console clean.

### P2.2 Shelf: avoid rendering full books/movies wall in initial HTML

Current problem:

- `/shelf` HTML is ~296.2 KB.
- It renders all books and movies into server HTML.
- Movies are visually limited per rating group, but hidden items are still in DOM.

Recommended solution:

1. Server-render current reading and a limited top slice for read/watched lists.
2. Move full book/movie data to static JSON or API endpoint.
3. Expand/show-more loads or reveals client-side from JSON.
4. Keep SEO-useful summary content server-rendered.

Acceptance criteria:

- `/shelf` initial HTML target under ~200 KB.
- Reading and top rated items still visible without interaction.
- Full lists remain accessible with show more.

Verification:

- `curl` HTML size before/after.
- Browser check reading/watching sections and show-more controls.

### P2.3 Builds: reduce card payload and defer metadata

Current problem:

- `/builds` HTML is ~298.5 KB.
- It renders all project cards and serializes language icons.

Recommended solution:

1. Audit `PROJECTS` and `ProjectCard` for large inline HTML/icons/images.
2. Keep visible project cards server-rendered but reduce repeated icon markup where possible.
3. Defer GitHub-derived metadata to client fetch or existing hydration only.
4. Consider pagination/group collapse only if content keeps growing.

Acceptance criteria:

- `/builds` HTML reduced meaningfully without hurting design.
- Existing project metadata hydration still works.

Verification:

- HTML size before/after.
- Browser visual check.
- Console/network clean.

## Measurement and verification plan

### Baseline script

Use the current curl baseline and save the output in the work log after implementation begins:

```bash
python3 - <<'PY'
import subprocess, statistics, json, time
routes=['/','/blog','/gists','/misc','/whoami','/takes','/shelf','/uses','/heatmap','/builds','/topics','/guestbook','/llms','/lab','/lab/travel-egypt']
base='https://www.leohuynh.dev'
out=[]
for path in routes:
    vals=[]; totals=[]; sizes=[]; statuses=[]
    for i in range(2):
        p=subprocess.run(['curl','-sS','-o','/dev/null','-w','%{http_code} %{time_starttransfer} %{time_total} %{size_download}',base+path],capture_output=True,text=True,timeout=30)
        if p.returncode:
            statuses.append('ERR')
        else:
            a=p.stdout.split(); statuses.append(a[0]); vals.append(float(a[1])); totals.append(float(a[2])); sizes.append(int(a[3]))
        time.sleep(0.2)
    out.append({'route':path,'status':statuses,'ttfb_ms':[round(x*1000) for x in vals],'median_ttfb_ms':round(statistics.median(vals)*1000) if vals else None,'median_total_ms':round(statistics.median(totals)*1000) if totals else None,'size_kb':round((statistics.median(sizes) if sizes else 0)/1024,1)})
print(json.dumps(out,indent=2))
PY
```

### Local verification per implementation phase

- `bun run check`
- `bun run build`
- start local dev server: `bun dev --host 127.0.0.1`
- browser smoke:
  - click from `/` to `/guestbook`, `/shelf`, `/heatmap`, `/builds`, `/llms`.
  - check pending state, route swap, and console.
- production/preview smoke after PR/deploy:
  - repeat curl headers and timings.
  - verify Vercel preview cache status for SSR routes.

## Implementation ordering recommendation

1. Implement P0 pending state + targeted prefetch first.
2. Verify the subjective issue improves locally and on preview.
3. Implement P1 guestbook next, because it is the clearest measured server/data blocker.
4. Re-measure before touching P2; static payload refactors are bigger and less urgent if P0 solves perceived wait.
5. Treat heatmap P2 as the first static payload refactor if the issue remains visible.

## Risks and tradeoffs

- Aggressive `viewport` prefetch can behave like eager/on-load prefetch for visible persistent-sidebar links. Never use `viewport` for `/guestbook`, `/llms`, or `/dotfiles/*` while those paths still have server/data blockers.
- Moving guestbook entries to client fetch reduces no-JS content, but the route is `noindex` and UGC; perceived interactivity is more important.
- Guestbook caching is an auth boundary. Public cache is allowed only for anonymous approved-entry responses; authenticated/admin responses must remain `no-store`.
- Static asset extraction for heatmap can reduce HTML but may shift cost to client JS/data. Verify actual route transition feel, not only HTML size.
- Snapshotting dotfiles tree introduces freshness maintenance. This is acceptable if a refresh script is documented.

## Open questions before implementation

1. Should `/guestbook` keep server-rendered entries for no-JS users, or is client-loaded wall acceptable?
2. Should `/guestbook` use `hover` or `tap` prefetch before P1 lands? (`viewport` is explicitly disallowed until the route no longer blocks on Supabase.)
3. For `/heatmap`, is a non-interactive SVG image acceptable initially, or must all existing map interactions remain on first render?
4. Should dotfiles tree freshness be manual snapshot refresh, scheduled job, or still live with stronger CDN/API caching?
