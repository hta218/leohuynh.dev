# M11 cutover handoff — hoist Astro v4 to repository root

## Goal

Perform the final clean cutover on branch `v4`: hoist the Astro app currently under `v4/` to the repository root, remove the legacy Next.js source from this branch, and leave the repo in a production-ready clean root layout.

This is a continuation of the existing v4 rebuild spec, not a new project. Read these first:

1. `.docs/specs/2026-06-14--v4-astro-rebuild/README.md`
2. `.docs/specs/2026-06-14--v4-astro-rebuild/plan.md`
3. `.docs/specs/2026-06-14--v4-astro-rebuild/route-inventory.md`
4. `.docs/specs/2026-06-14--v4-astro-rebuild/work-log.md`

## Current context

- Work on branch `v4` only.
- Legacy code is preserved on other branches (`origin/main`, `origin/v3`, `origin/legacy-v3`, etc.), so this branch should become clean Astro root.
- The Astro app in `v4/` already passed `bun run check` and `bun run build` before this handoff.
- Root currently still contains the legacy Next app plus root Vercel shims that build `v4/` with `cd v4`.
- Do not push. Hermes will review/verify and decide commit/push after your run.

## Required cutover result

After completion:

- Running from repo root works:
  - `bun install`
  - `bun run check`
  - `bun run build`
  - optionally `bun run dev`
- `package.json` at root is the Astro package/scripts from the old `v4/package.json`.
- `astro.config.mjs`, `tsconfig.json`, `src/`, `api/`, `scripts/`, and Astro config files live at root.
- The `v4/` directory is removed.
- Legacy Next-only app source is removed from this branch:
  - `app/`, `components/`, `layouts/`, `hooks/`, `db/`, `supabase/`, `css/`, legacy Next configs, Contentlayer config, and unused Next-only scripts/deps.
- Shared site content/assets are preserved:
  - `data/`
  - `json/`
  - `public/static/`
  - `icons/`
  - `.docs/specs/2026-06-14--v4-astro-rebuild/`
  - `.github/`, `.husky/`, `CLAUDE.md`, `README.md`, license/config files that still apply.
- `vercel.json` is root-native and no longer uses `cd v4`, `v4/dist`, or Root Directory shims.

## Path fixes to expect

Update all assumptions that existed only because Astro lived under `v4/`:

- Content collection globs:
  - `../data/blog` -> `./data/blog`
  - `../data/snippets` -> `./data/snippets`
- Cached media JSON reads:
  - `../json/books.json` -> `./json/books.json`
  - `../json/movies.json` -> `./json/movies.json`
- Icon raw imports:
  - examples like `../../../icons/*.svg?raw` or `../../../../icons/*.svg?raw` need one fewer `../` after hoist, depending on the file location.
- Static assets:
  - Root already has `public/static`, so `scripts/link-static.mjs` should become a safe no-op/check or be removed from scripts if unnecessary.
  - Do not delete `public/static`.
- Vercel function:
  - Preserve the real stats function as root `api/stats.ts`.
  - Remove any old root shim that only delegated to `v4/api/stats.ts`.
- Lockfiles/package manager:
  - Prefer the Astro/Bun setup as the source of truth.
  - Remove stale root Next lock/config artifacts when they no longer apply.
  - If both `bun.lock` and `pnpm-lock.yaml` exist, keep only what the final Astro root actually uses unless the current repo convention explicitly requires both.

## Verification requirements

Run and record real outputs:

1. `git status --short --branch`
2. `bun install`
3. `bun run check`
4. `bun run build`
5. HTTP smoke after a local server/preview if practical:
   - `/`
   - `/blog`
   - representative blog detail
   - `/snippets`
   - representative snippet detail
   - `/projects`
   - `/about`
   - `/books`
   - `/movies`
   - `/tags`
   - `/feed.xml`
   - `/search.json`
   - `/api/github-streak.json`
   - `/api/github-today.json`
   - `/api/activity.json`
   - `/static/resume.pdf`
6. Browser smoke if practical:
   - homepage visual sanity
   - project page visual sanity
   - right rail GitHub widgets render without console errors
   - statusbar / made-in-Vietnam badge renders without layout break

## Documentation update

Update `work-log.md` with what changed and the exact verification output. Mark M11 complete in `plan.md` only if the cutover is actually done and verification passes.

## Constraints

- Do not commit secrets or local `.env*` values.
- Do not mutate `main`, `v3`, or `legacy-v3`.
- Do not push to remote.
- Do not silently skip broken routes/APIs. If blocked, document the blocker and stop.
- Prefer simple root-native Astro over compatibility shims.
