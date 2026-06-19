# Handoff Context - 2026-06-19 08:20

## Project
- Repository: hta218/leohuynh.dev (git@github.com:hta218/leohuynh.dev.git)
- Branch: `v4`
- Spec: `.docs/specs/2026-06-14--v4-astro-rebuild/`
- Last Updated: 2026-06-19 08:20

## Current Status

Work focused on the home page **right sidebar (RuntimeRail)** — the GitHub stats
panel and the "recent activity" feed. All changes are in the canonical root
`src/` tree (the project was restructured from `v4/src/` → `src/`; see Known
Issues).

### What's Been Done (this session, UNCOMMITTED in working tree)
1. **GitHub daily LOC accuracy** (done earlier; now lives in HEAD via the user's
   own re-implementation using `viewer.repositories` in `buildGithubDayPayload`).
2. **Renamed the heatmap box** heading `github streak` → `git grass`
   (`src/components/studio/RuntimeRail.astro:34`).
3. **Recent activity — privacy**: `fetchLatestGithubActivity` now excludes
   private repos — added `is:public` to the search query plus `isPrivate`
   filters on both the commit path and the PR fallback
   (`src/lib/runtime.ts` ~L583–L693).
4. **Recent activity — order**: `currently reading` → `last watched` → github
   (swapped push order in `fetchActivity`, `src/lib/runtime.ts` ~L717–L745).
5. **"last watched" now = most recently rated** (not top-rated): added
   `dateRated` to `Movie` + mapping (`src/lib/media.ts:34,79`) and sort by it.
6. **Movie subtitle shows both runtime + rating** (`1988 • 106 mins • ★ 10`) —
   pending user's final choice on format (see What's Next).
7. **Activity card label fix**: meta label (`currently reading` / `last
   watched`) now renders on its **own line** (mono uppercase, muted) above the
   title so the title is no longer truncated; label only for book/movie, not
   github (`src/components/studio/RuntimeRail.astro` ~L556–L569).

### What's In Progress / Pending Decision
- **Movie subtitle format**: currently shows `year • runtime mins • ★ rating`
  as a combined "try both" view. User to decide whether to keep runtime, rating,
  or both.
- **Other live-parity diffs** still open: book subtitle `by <author>` prefix
  (live has "by", v4 shows just author name).

### What's Next
- **Stale book/movie data** (biggest open item): v4 reads static JSON snapshots
  (`json/books.json` from Goodreads RSS, `json/movies.json` from IMDb+OMDB),
  last regenerated 2025-02-07, so they're stale vs the live site (which reads a
  live DB). See `src/lib/media.ts:4-10`. Three options discussed:
  1. Regenerate + commit fresh JSON snapshots (no script in this repo yet).
  2. Wire up live DB (Drizzle) as the code comment suggests → dynamic pages.
  3. **Recommended**: fetch Goodreads RSS at build/runtime for books (public,
     no auth, stays static); keep snapshot/OMDB for movies.
- Finalize movie subtitle format once user picks.

## Technical Context

### Modified Files (uncommitted)
**This session's work:**
- `src/lib/runtime.ts` — private-repo filter, activity order, dateRated sort,
  movie subtitle/meta. NOTE: also contains a pre-existing user edit removing the
  `?? env('NEXT_UMAMI_ID')` fallback in `getUmamiWebsiteId` (not from this
  session — keep it).
- `src/lib/media.ts` — `dateRated` field + mapping.
- `src/components/studio/RuntimeRail.astro` — `git grass` rename + activity card
  label line.

**Pre-existing user changes (not this session, present in working tree):**
- `.env.example`, `src/layouts/BaseLayout.astro`, `src/lib/comments.ts`,
  `src/lib/projects.ts`, `src/pages/gists/[...slug].astro`,
  `src/pages/log/[...slug].astro`.

### Key Decisions
- Sidebar (`#runtime-rail`) uses `transition:persist` + a `dataset.hydrated`
  guard so GitHub/activity data fetches **once per session**; Spotify refreshes
  on a 45s interval. → After code changes you must **hard reload**
  (Cmd+Shift+R); soft route navigation will not refetch.
- Activity card labels are stacked (own line) rather than inline because the
  narrow rail truncates an inline `label: title`.

### Known Issues
- **Repo restructure**: earlier in the session I worked under `v4/src/` (cwd was
  `.../leohuynh.dev/v4`) and committed there; that tree was superseded when the
  project was promoted to root `src/`. Those early commits are NOT in the `v4`
  branch history. All current/valid work is in root `src/`. Don't look for
  `v4/src/` anymore.
- Book/movie data is stale (see What's Next).

## Dependencies & Prerequisites
- Dev server: `nr dev` (NOT pnpm) → `astro dev --port 3434`.
- Typecheck: `nr typecheck` / `npx astro check` (currently 0 errors, 44
  pre-existing hints).
- Pre-commit: husky + lint-staged runs biome; **commitlint enforces
  Conventional Commits** (`feat:`/`fix:`/`chore:`...) — plain messages are
  rejected by the hook.
- GitHub API needs `GITHUB_API_TOKEN` (with `repo` scope) in `.env.local`;
  Spotify needs SPOTIFY_* vars.

## Additional Notes
- Verify behavior with a hard reload of the home page after pulling.
- The `is:public` filter + `isPrivate` checks are belt-and-suspenders; both were
  kept intentionally to guarantee no private repo leaks into recent activity.
