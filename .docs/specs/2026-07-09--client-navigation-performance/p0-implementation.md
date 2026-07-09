# P0 implementation notes

Date: 2026-07-09
Branch: `perf/client-navigation-spec`

## Scope implemented

P0 only:

- Added a shell-level navigation pending indicator driven by Astro client-router lifecycle events.
- Added explicit targeted `data-astro-prefetch` strategies for left-sidebar links.

No P1/P2 work was implemented:

- No guestbook data-loading change.
- No guestbook API/cache behavior change.
- No dotfiles data-source/snapshot change.
- No `/llms` data-source change.
- No route URL/canonical behavior change.

## P0.1 pending state

Files:

- `src/components/studio/StudioShell.astro`
- `src/components/studio/studio-shell/client/boot.ts`
- `src/components/studio/studio-shell/client/globals.ts`
- `src/components/studio/studio-shell/client/nav-pending.ts`
- `src/styles/studio.css`

Behavior:

- `astro:before-preparation` schedules `html[data-nav-pending="true"]` after a short delay.
- `astro:after-swap` and `astro:page-load` clear pending state.
- A 12s fallback clears pending state if navigation hangs/errors.
- The visual indicator is a subtle tab-bar progress line and respects `prefers-reduced-motion: reduce`.

## P0.2 targeted prefetch

Files:

- `src/components/studio/studio-shell/lib/explorer-tree.ts`
- `src/components/studio/studio-shell/Sidebar.astro`
- `src/components/studio/DotfilesNav.astro`

Strategies:

- `viewport`: `/shelf`, `/heatmap`, `/builds`, `/topics`, `/uses`.
- `hover`: `/guestbook`, `/llms`.
- `false`: external stats link and `/dotfiles/*` file links.

Hard rules preserved from Claude audit:

- `/guestbook` does not use `viewport`.
- `/llms` does not use `viewport`.
- `/dotfiles/*` does not use `viewport`.
- External stats link is opted out with `data-astro-prefetch="false"`.

## Verification performed

- `bun run check` — passed, 0 errors/warnings/hints.
- `bun run build` — passed.
- Local dev server at `http://127.0.0.1:3434/`.
- Browser DOM check confirmed expected prefetch attributes:
  - heavy static links: `viewport`.
  - `/guestbook` and `/llms`: `hover`.
  - stats and dotfiles links: `false`.
- Browser click smoke to `/guestbook` succeeded.
- Manual lifecycle simulation confirmed pending indicator sets on `astro:before-preparation` and clears on `astro:after-swap`.
- Browser console check: no JS errors.
