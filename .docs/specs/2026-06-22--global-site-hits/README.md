# Feature: Site Stats — Hits + Live Visitors (Umami)

| Field            | Value                                   |
| ---------------- | --------------------------------------- |
| **Status**       | in-progress                             |
| **Owner**        | @hta218                                 |
| **Issue**        | N/A                                     |
| **Branch**       | `feat/global-site-hits`                 |
| **Created**      | 2026-06-22                              |
| **Last Updated** | 2026-06-23                              |

## Original Prompt

> Build global site hits counter and display on home page

## Summary

Two home-page surfaces share one live `/api/site-stats.json` endpoint:

- **Stat cards** — `notes` (posts+snippets), `hits` (Umami all-time pageviews), `live visitors`
  (Umami active now, pulsing dot).
- **Build-log manifest** — the "build log" section renders a real `site.json` manifest: build-time
  facts (content counts, LOC, files, stack) + live numbers (traffic, reactions, repo commits/stars).

Live data is read from **Umami** (public share token — no API credentials), the **GitHub** repo,
and the **`stats`** table. This replaces the original v1 approach (a custom `site_counters`
Postgres counter incremented on every page load), dropped once we confirmed Umami's share link
exposes pageviews + realtime visitors for free.
