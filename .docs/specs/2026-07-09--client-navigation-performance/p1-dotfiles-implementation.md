# P1.2 implementation notes

Date: 2026-07-10
Branch: `perf/client-navigation-spec`

## Scope implemented

P1.2 only — avoid GitHub-backed cold fetch in every shell render.

- Added a checked-in dotfiles sidebar tree snapshot at `json/dotfiles-tree.json`.
- Added `bun run dotfiles:refresh` to regenerate the snapshot from the public
  `hta218/dotfiles` GitHub tree.
- Updated `src/lib/dotfiles.ts` so `getDotfilesTree()` returns the static snapshot
  instead of fetching `GET /repos/hta218/dotfiles/git/trees/main?recursive=1`
  during page render.
- Kept `getDotfileEntry()` live/on-demand for individual `/dotfiles/*` content
  pages.

Explicitly NOT in this slice:

- No P1.3 `/llms` data-source change.
- No P2 static payload refactors.
- No route URL / canonical change, no env change, no DB change.
- No cache-header changes for individual dotfile content routes.

## Files changed

- `json/dotfiles-tree.json`
  - Static nested tree used by the sidebar.
- `scripts/refresh-dotfiles-tree.ts`
  - Fetches the GitHub recursive tree, reuses `buildTree()`, and refuses to
    overwrite the snapshot with an empty tree.
- `package.json`
  - Adds `dotfiles:refresh` script.
- `src/lib/dotfiles.ts`
  - Imports the snapshot directly so it is bundled with the app.
  - Exports `buildTree()` for the refresh script.
  - Keeps `getDotfilesTree()` async for existing call sites, but no longer makes
    a network request.

## Verification performed

- `bun run dotfiles:refresh` — passed, wrote 10 top-level nodes.
- `git diff --check` — passed.
- `bun run check` — passed, 0 errors / 0 warnings / 0 hints.
- `bun run build` — passed.
- Built server bundle inspection:
  - `BaseLayout` chunk includes the bundled `json/dotfiles-tree.json` snapshot.
  - no `git/trees` or `readFileSync` path remains in that shell chunk.
- Browser smoke on local dev server:
  - `/dotfiles` renders the sidebar tree from the snapshot.
  - `/dotfiles/.zshrc` still renders live file content.
  - browser console was clean.
- Autoreview Copilot local diff — clean, no actionable findings.

## Expected impact

- SSR routes that render `StudioShell` no longer have a cold request-time GitHub
  tree dependency for the dotfiles sidebar.
- Dotfiles sidebar remains visible and sorted with the same deny-list/folders-first
  rules.
- Individual dotfile pages may still wait on GitHub content fetch; that is the
  existing page-specific behavior and remains covered by route pending UX/CDN cache.
