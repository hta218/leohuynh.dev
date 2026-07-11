# P1 implementation notes

Date: 2026-07-10
Branch: `perf/client-navigation-spec`

## Scope implemented

P1.1 only — guestbook should not block first route paint.

- `/guestbook` document now renders without awaiting `getGuestbookEntries()`.
- Cheap cookie-based session/current-user/admin detection stays server-side.
- `GuestbookWall` fetches the first page client-side on mount from the existing
  `GET /api/guestbook`, showing a skeleton first and the empty state only after
  the fetch returns empty.

Explicitly NOT in this slice (deferred):

- P1.2 dotfiles snapshot / GitHub cold-fetch change.
- P1.3 `/llms` data-source change.
- P2 static payload refactors.
- No route URL / canonical change, no env change, no DB change.
- No public CDN caching added. The read API keeps `cache-control: no-store`
  because anonymous vs admin responses share the endpoint and admin responses
  include moderation-only data (`status`, pending/hidden entries). Safe
  anonymous/admin cache separation was out of scope, so no cache is used.

## Files changed

- `src/pages/guestbook.astro`
  - Removed `await getGuestbookEntries(...)` and the SSR entries try/catch.
  - Removed now-unused `getGuestbookEntries` / `GuestbookEntry` imports.
  - Passes `initialEntries={[]}`, `initialNextCursor={null}`,
    `deferInitialLoad={true}` to `GuestbookWall`.
  - Kept `prerender = false` and cookie-based `currentUser` / `isAdmin`.
- `src/components/guestbook/use-guestbook.ts`
  - Added optional `deferInitialLoad` prop to `GuestbookViewProps`.
  - Added a `loading` state (init `deferInitialLoad ?? false`) exposed by the hook.
  - Added a mount `useEffect` that fetches `GET /api/guestbook` when deferred,
    sets entries/cursor, and clears `loading`. On failure it logs and falls back
    to the empty state (mirrors the old server-side catch), with a `cancelled`
    guard for unmount / strict-mode double-invoke.
- `src/components/guestbook/GuestbookWall.tsx`
  - Renders `WallSkeleton` + an `sr-only role="status"` line while `gb.loading`.
  - Empty state ("no commits yet") now shows only when not loading and empty.
  - Commit count shows `… commits` while loading.
- `src/components/guestbook/guestbook-wall/WallSkeleton.tsx` (new)
  - Presentational 3-row pulse skeleton reusing the graph `Rail`.

## Behavior preserved

- Load-more, submit (approved/pending), admin moderation, pending notice, and
  current-user composer behavior are unchanged — they run through the same hook
  actions and the same API routes.
- The client fetch is same-origin, so the session cookie is sent and admins
  still receive their full moderation view (all statuses) from the API.

## Verification performed

- `bun run check` — passed, 0 errors / 0 warnings / 0 hints.
- `bun run build` — passed.
- Local dev server at `http://127.0.0.1:3434/`.
- Local curl smoke:
  - `/guestbook` returned 200 and no longer included existing entry content in
    the server HTML.
  - server HTML includes the loading skeleton/status instead.
  - `/api/guestbook` returned 200 with `cache-control: no-store`.
- Browser smoke on `/guestbook`:
  - entries loaded through a client `fetch` to `/api/guestbook`.
  - wall rendered loaded entries and load-more control.
  - browser console was clean.

### Not verified here (blockers / follow-up)

- Authenticated/admin moderation flow requires a signed-in GitHub session in the
  browser; the code path is unchanged and still uses the same API routes/cookie.
