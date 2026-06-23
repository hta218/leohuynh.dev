# Feature: Token Burn Widget

| Field            | Value                                              |
| ---------------- | -------------------------------------------------- |
| **Status**       | done                                        |
| **Owner**        | @hta218                                             |
| **Issue**        | N/A                                                |
| **Branch**       | `v4` (working branch)                              |
| **Created**      | 2026-06-19                                          |
| **Last Updated** | 2026-06-19                                          |

## Original Prompt

> Build token burn stats widget for the blog's runtime rail. The widget should surface AI coding token-burn stats (cost + tokens across Claude Code, Codex, Copilot, opencode) from the private `token-burn` repo. The blog reads the repo's pre-aggregated, safe-to-expose `public/summary.json` server-side via the GitHub Contents API (PAT in env, never shipped to the client), then renders a compact card next to the existing Spotify / git-grass widgets.

## Summary

Surface AI coding token-burn stats (cost + tokens across Claude Code, Codex,
Copilot, opencode) from the private `token-burn` repo on the blog's runtime rail.
The blog reads the repo's pre-aggregated, safe-to-expose `public/summary.json`
server-side via the GitHub Contents API (PAT in env, never shipped to the client),
then renders a compact card next to the existing Spotify / git-grass widgets.

## Decisions

- **Access method**: GitHub Contents API, fetched server-side in
  `src/lib/runtime.ts`. Reuses the existing `GITHUB_API_TOKEN` (it already has
  read access to the private `hta218/token-burn` repo) — no separate PAT needed.
  Chosen because the blog already renders integrations server-side and the repo
  is private — no public mirror / Pages needed.
- **Display**: small card in `RuntimeRail.astro` (all-time cost + tokens, today,
  last 7 days, top model).
- **Windows** (`today`, `last7Days`, `last30Days`) are computed from `daily[]`
  using the existing Hanoi-timezone helpers — the files intentionally omit them.
</content>
</invoke>
