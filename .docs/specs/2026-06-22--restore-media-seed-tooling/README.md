# Feature: Restore Books/Movies Seed Tooling

| Field            | Value                                       |
| ---------------- | ------------------------------------------- |
| **Status**       | draft                                       |
| **Owner**        | @hta218                                      |
| **Issue**        | N/A                                         |
| **Branch**       | `feat/restore-media-seed-tooling`           |
| **Created**      | 2026-06-22                                  |
| **Last Updated** | 2026-06-22                                  |

## Original Prompt

> A nhận ra là omdb xóa là sai, cái đó dùng để seed data, và a nhận ra thêm khi
> migrate lên v4 (xem spec v4) - chú cũng xóa luôn phần seed logic (goodread +
> imdb data), đúng k?
>
> cái này là việc riêng, chú viết specs cho a là đc, để làm sau

## Summary

The v4 Astro rebuild removed the legacy Next.js app and, with it, the seeding
tooling that populated the Supabase `books` and `movies` tables (Goodreads RSS +
CSV for books, IMDb CSV + OMDB API for movies). The shelf pages still read those
tables live via `src/lib/media.ts`, but there is no longer any in-repo way to
refresh the data, so it is frozen. This feature restores a v4-native seed script
so books/movies can be re-synced on demand.

## Context: what was removed

| Commit    | Removed                                                                 |
| --------- | ---------------------------------------------------------------------- |
| `2a7c797` | `scripts/seed.ts` (399 lines) + npm script `"seed": "tsx ./scripts/seed.ts"` |
| `7b1ef78` | `scripts/imdb-movies.csv`                                               |

The old `scripts/seed.ts` depended on Drizzle ORM (`~/db/queries`, `~/db/schema`),
`drizzle-zod` validation, `rss-parser`, and `csv-parser`. v4 dropped Drizzle in
favour of the raw `postgres` client via `getSql()` (`src/lib/db.ts`), so the seed
logic must be re-implemented against raw parameterized SQL — it cannot be restored
verbatim.

## Decision (to confirm at implementation time)

- Re-implement seeding as a v4-native standalone script using `getSql()` and raw
  upserts (no Drizzle re-introduction).
- Keep `OMDB_API_KEY` as a **seed-time only** env var (already restored to `.env`).
- Books source: Goodreads RSS feed (public, no auth) preferred; CSV import path
  optional as a fallback for full history.
- Movies source: IMDb ratings CSV export + OMDB API enrichment (poster/plot/runtime).

## Open Questions

- Books refresh strategy: keep a manual `bun run seed`, or move Goodreads RSS to a
  build/runtime fetch (the v4 handoff doc recommended runtime RSS for books, OMDB
  snapshot for movies)?
- Do we also regenerate the `json/books.json` / `json/movies.json` snapshots (used
  as offline fallback by `media.ts`), or only write the Supabase tables?
- Where does the IMDb CSV live now that `scripts/imdb-movies.csv` is gone — manual
  drop-in before each run, or a tracked file?
