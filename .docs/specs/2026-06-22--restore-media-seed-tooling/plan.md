# Plan: Restore Books/Movies Seed Tooling

## Goal

Bring back an in-repo way to (re)seed the Supabase `books` and `movies` tables,
re-implemented for the v4 Astro stack (raw `postgres` via `getSql()`, no Drizzle).

## Reference: how it worked before (commit `2a7c797~1`)

`scripts/seed.ts` exposed:

- `seedBooksUsingRssFeed()` — parse `SITE_METADATA.goodreadsFeedUrl` with
  `rss-parser`, validate, `upsertBooks()`.
- `seedBooksByParsingCSV()` — parse a Goodreads CSV export with `csv-parser`,
  transform to the book shape, `upsertBooks()`.
- `seedMovies()` — read IMDb ratings CSV, enrich each title via
  `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`,
  `upsertManyMovies()`.
- `seed()` — orchestrator running the above.

It used Drizzle (`~/db/queries`, `~/db/schema`, `drizzle-zod`). v4 removed all of
that, so the upsert + validation layers must be rewritten.

## Target data shape (match what `src/lib/media.ts` reads)

`books` table columns (per `mapBook`):

- `title`, `link`, `guid`, `book_id` (a.k.a. `id`),
- `book_large_image_url` / `book_medium_image_url` / `book_image_url`,
- `book_description`, `author_name`, `user_rating`, `user_shelves`,
  `average_rating`.

`movies` table columns (per `mapMovie`):

- `id` (a.k.a. `const`), `title`, `url`, `title_type`, `your_rating`,
  `imdb_rating`, `date_rated`, `year`, `genres`, `directors`, `poster`, `plot`,
  `runtime`.

The seed must write these exact column names so the live `select * from books`
/ `movies` queries keep mapping correctly.

## Sources / config (already in repo)

- `src/lib/site.ts`:
  - `goodreadsBookshelfUrl` — Goodreads list URL (derive the RSS feed URL from it,
    or add an explicit `goodreadsFeedUrl`).
  - `imdbRatingsList` — IMDb ratings grid URL (CSV is exported manually from here).
- `OMDB_API_KEY` — restored in `.env`, seed-time only.

## Files to add

- `scripts/seed.ts`
  - v4-native orchestrator. Reads env via `process.env` (script runs under
    `bun`/`tsx`, not Astro), gets a connection through a small local copy of the
    `postgres` client (or imports `getSql()` if it runs cleanly outside Astro).
  - Functions: `seedBooks()` (RSS, + optional CSV), `seedMovies()` (CSV + OMDB),
    `seed()` orchestrator with a CLI arg to run one or both.
  - Parameterized upserts: `insert ... on conflict (guid|id) do update set ...`.

- `scripts/lib/goodreads.ts` (optional split)
  - RSS + CSV parsing → normalized book rows.

- `scripts/lib/omdb.ts` (optional split)
  - IMDb CSV row → OMDB fetch → normalized movie row, with basic rate limiting.

- `src/types/media-seed.ts` (or extend existing media types)
  - `GoodreadsBook`, `GoodreadsCsvBook`, `ImdbMovie`, `OmdbMovie`, plus the
    insert row shapes. Pure types, no Drizzle.

## Files likely to change

- `package.json`
  - Re-add `"seed": "tsx ./scripts/seed.ts"` (or a `bun` equivalent) and the
    dev deps `rss-parser`, `csv-parser` (and `@types/*` if needed). Confirm `tsx`
    is still present or use `bun run`.
- `src/lib/site.ts`
  - Add an explicit `goodreadsFeedUrl` if RSS is used (currently only the bookshelf
    list URL exists).
- `.env.example`
  - Document `OMDB_API_KEY` as a seed-time var (currently only in `.env`).

## Validation strategy

- Replace `drizzle-zod` with hand-written validators (or add plain `zod`) that
  enforce required columns + types before upsert.
- Skip/log malformed rows instead of failing the whole run (the live read already
  tolerates bad JSON cells; the seed should not write garbage).

## Implementation steps

1. Recover the old `scripts/seed.ts` from `2a7c797~1` for reference only
   (`git show 2a7c797~1:scripts/seed.ts`). Do not restore verbatim.
2. Decide books strategy (manual RSS seed vs. runtime RSS) per open question.
3. Add types + parsing helpers.
4. Add raw-SQL upserts matching the `books` / `movies` column names above.
5. Wire `scripts/seed.ts` orchestrator + npm/bun script.
6. Dry-run against a throwaway / staging table first; verify `media.ts` still maps
   rows correctly, then run against the real tables.
7. Optionally regenerate `json/books.json` / `json/movies.json` snapshots.

## Verification

```bash
bun run check
bun run seed        # or: bun run scripts/seed.ts
```

- Confirm row counts in `books` / `movies` increase / refresh.
- Load `/books` and `/movies` locally; covers/posters render, ratings sort.
- Confirm no secret leakage: `OMDB_API_KEY` is seed-time only, never bundled into
  client output.

## Scope / files touched (summary)

- Add: `scripts/seed.ts`, optional `scripts/lib/goodreads.ts`,
  `scripts/lib/omdb.ts`, `src/types/media-seed.ts`.
- Change: `package.json`, `src/lib/site.ts`, `.env.example`.
- Read-only reference: `src/lib/media.ts`, `src/lib/db.ts`, git commit `2a7c797~1`.

## Out of scope

- Changing how `/books` and `/movies` render or read at runtime.
- Re-introducing Drizzle ORM or any migration system.
- Automating the seed on a schedule (could be a follow-up: cron / GitHub Action).
