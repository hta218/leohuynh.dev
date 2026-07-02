# Umami v3 integration update

Status: completed (implemented 2026-07-02)
Owner: @hta218
Created: 2026-07-02
Branch: `v4` (do the work on a `update/umami-v3-integration` branch off `v4`)

## Original prompt

> The self-hosted umami analytics behind `analytics.leohuynh.dev` was upgraded from v2.13.2 to v3.2.0
> (in-place, data preserved). Write a spec on the leohuynh.dev (blog) side listing the umami-related
> things that need updating for the new version. I'll do the work later.

## Summary

The analytics backend (`analytics.leohuynh.dev`, self-hosted umami fork `hta218/blog-analytics`) was
upgraded **v2.13.2 → v3.2.0**. The tracker script and public share URL keep working unchanged, but the
blog's **server-side stats client (`src/lib/runtime/umami.ts`) is BROKEN on v3** and must be fixed —
two breaking changes verified live against the v3 API. There are also optional v3 tracker features the
blog can adopt.

## Scope of impact (files)

- `src/lib/runtime/umami.ts` — **REQUIRED fix** (share auth + `/stats` response shape).
- `src/layouts/BaseLayout.astro` — optional (new tracker attributes, e.g. Web Vitals).
- No change needed: `src/lib/site.ts` (share URL still valid), `vercel.json` (CSP/proxy unchanged),
  `src/components/widgets/Reactions.tsx` & guestbook (`data-umami-event` still works in v3).

See `plan.md` for the concrete changes and verification steps.
