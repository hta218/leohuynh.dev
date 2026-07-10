# Client navigation performance

## Status

In progress — P0 (pending state + targeted prefetch) and P1.1 (guestbook
non-blocking first paint) implemented. P1.2, P1.3, and P2 not started.

## Owner

Leo Huynh / Hermes Agent

## Original prompt

Investigate why some data-heavy routes feel slow on first click from the left navigation, identify affected routes, write findings, propose P0-P2 solutions, and run a Claude review before implementation.

## Scope

This spec covers perceived slowness during Astro client-side navigation in the v4 StudioShell experience, especially from the persistent left explorer/sidebar.

## Artifacts

- `findings.md` — measured route performance, source-level findings, and route classification.
- `plan.md` — proposed P0-P2 optimization plan and verification strategy.
- `claude-audit.md` — Claude Code audit/review output after the draft spec is written.
- `p0-implementation.md` — P0 implementation notes (pending state + prefetch).
- `p1-implementation.md` — P1.1 implementation notes (guestbook non-blocking first paint).

## Current branch

`perf/client-navigation-spec`

## Non-goals for this draft

- No production code changes yet.
- No database schema changes.
- No env or Vercel config changes.
- No removal of site features.
