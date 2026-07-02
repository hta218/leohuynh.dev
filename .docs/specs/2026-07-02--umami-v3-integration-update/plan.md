# Plan: Umami v3 integration update

Backend upgraded `analytics.leohuynh.dev` from umami v2.13.2 → v3.2.0. Website id and public share
token (`c9ErglxqzY5CQJ8g`) are unchanged. All findings below were verified live against the v3 API on
2026-07-02.

## 1. REQUIRED — fix `src/lib/runtime/umami.ts` (stats client is broken on v3)

Two independent breaking changes. Both must be fixed or `fetchUmamiTraffic()` returns all `null`
(the global site-hits / traffic numbers stop showing).

### 1a. Share requests now require an extra header (else HTTP 401)

v3 added a security check: a share token is only accepted when the request also carries the
`x-umami-share-context` header (any truthy value; the umami UI sends `'1'`). Our client only sends
`x-umami-share-token`, so every `/api/websites/{id}/*` call now returns **401**.

Fix — in `umamiWebsiteFetch`, add the context header:

```ts
const res = await fetch(
  `${auth.base}/api/websites/${auth.websiteId}${path}`,
  {
    headers: {
      'x-umami-share-token': auth.token,
      'x-umami-share-context': '1', // v3 requires this alongside the share token, else 401
    },
    signal: timeoutSignal(),
  },
)
```

(The share-auth resolution `GET /api/share/{shareId}` → `{ websiteId, token }` is UNCHANGED — verified.
The existing 401/403 re-resolve-once retry is still correct and now also covers this case.)

### 1b. `/stats` response shape changed: flat numbers, not `{ value }`

- v2 returned: `{ pageviews: { value: N }, visitors: { value: N } }`
- **v3 returns (verified):**
  `{"pageviews":55718,"visitors":23813,"visits":28541,"bounces":23345,"totaltime":2230599,"comparison":{...}}`
  — the metrics are now **plain numbers**, and there's a new `comparison` object.

Our code reads `data.pageviews?.value` / `data.visitors?.value`, which are now `undefined` → `hits` and
`visitors` become `null` even with correct auth.

Fix — in `fetchUmamiTraffic`, update the `/stats` parsing:

```ts
if (statsRes?.ok) {
  const data = (await statsRes.json()) as {
    pageviews?: number
    visitors?: number
  }
  hits = typeof data.pageviews === 'number' ? data.pageviews : null
  visitors = typeof data.visitors === 'number' ? data.visitors : null
}
```

`/active` is UNCHANGED — v3 still returns `{ visitors: N }` and the current code already handles that
(and the legacy `{ x }`). No change needed there.

### 1c. Verify after fixing

From the blog (or curl), a request with BOTH headers must return data:

```
TOKEN=$(curl -s https://analytics.leohuynh.dev/api/share/c9ErglxqzY5CQJ8g | jq -r .token)
WID=$(curl -s https://analytics.leohuynh.dev/api/share/c9ErglxqzY5CQJ8g | jq -r .websiteId)
curl -s -H "x-umami-share-token: $TOKEN" -H "x-umami-share-context: 1" \
  "https://analytics.leohuynh.dev/api/websites/$WID/stats?startAt=0&endAt=$(date +%s)000"
# → 200 with {"pageviews":...,"visitors":...,...}
```

Then confirm the site-hits / traffic widget renders real numbers again.

## 2. OPTIONAL — adopt new v3 tracker features (`src/layouts/BaseLayout.astro`)

Basic tracking needs NO change: the blog loads `https://analytics.leohuynh.dev/script.js`, which now
serves the v3 tracker automatically; `data-website-id` is unchanged; pageviews keep flowing.

The tracker `<script>` (currently `src` + `data-website-id` only) can opt into new v3 attributes:

- `data-performance="true"` — track **Web Vitals** (TTFB, FCP, LCP, CLS, INP). New in v3; adds a
  Performance section in the dashboard. Highest-value addition for a blog.
- `data-exclude-search="true"` and/or `data-exclude-hash="true"` — strip query/hash so pageviews group
  by clean path.
- `data-tag="..."` — tag events (e.g. per environment) if useful.

Example:

```astro
<script
  is:inline
  defer
  src="https://analytics.leohuynh.dev/script.js"
  data-website-id={umamiWebsiteId}
  data-performance="true"
/>
```

## 3. NO CHANGE — verified still working

- Click-event tracking via `data-umami-event` (used in `Reactions.tsx`, guestbook `SignedOutPrompt.tsx`)
  is still supported in v3; v3 even improved `<a>` handling (waits to send before navigating). No change.
  Note: v3.2.0 has NO automatic outbound-link tracking — elements must be tagged manually (as we do).
- Public share URL in `src/lib/site.ts` (`.../share/c9ErglxqzY5CQJ8g/leohuynh.dev`) still resolves.
- `vercel.json` CSP + the `analytics.leohuynh.dev` proxy rewrite are unaffected (host unchanged).
- `window.umami.track(name, data)` API unchanged; new `window.umami.identify(id, data)` is available if
  we ever want per-visitor identity.

## Files touched (summary)

- `src/lib/runtime/umami.ts` — REQUIRED (§1a header, §1b `/stats` parsing).
- `src/layouts/BaseLayout.astro` — OPTIONAL (§2 tracker attributes).

## Notes / context

- Backend upgrade details, DB migration, and Vercel/Supabase specifics are documented on the
  analytics side (umami fork repo, spec `2026-07-02--sync-umami-v3-upgrade`).
- Live DB is Supabase project ref `sgcslnkjzroyulvzyrgh` (not the dead `lyaiwognwovzajonjlfb`).
