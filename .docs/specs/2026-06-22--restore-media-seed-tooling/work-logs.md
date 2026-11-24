# Work Logs

## 2026-06-22 — @hta218 (spec only)

- Spun this off as a standalone spec while configuring the guestbook env. While
  trimming `.env`, `OMDB_API_KEY` was removed as "unused" (no runtime reference in
  `src/`), then restored after realizing it is **seed-time** config.
- Traced the missing seed tooling: commit `2a7c797` ("Remove legacy Next.js
  application and tooling") deleted `scripts/seed.ts` during the v4 rebuild;
  `7b1ef78` removed `scripts/imdb-movies.csv`.
- Confirmed the old seed depended on Drizzle (`~/db/queries`, `~/db/schema`,
  `drizzle-zod`), which v4 dropped → must be re-implemented with raw `getSql()`.
- No code written yet. Status: `draft`, deferred ("để làm sau").

## 2026-11-24 — @hta218 (movies)

- Added `scripts/seed-movies.ts` + `bun run seed:movies <csv>`: raw `getSql()`
  upsert (no Drizzle), small inline CSV parser (no `csv-parser` dep).
- Every CSV row is upserted (ratings, votes, genres stay current); OMDB is only
  called for titles that are new or missing a poster. Stored OMDB columns are
  merged in JS before the upsert because every `movies` column is NOT NULL,
  which Postgres checks even on the `on conflict` path.
- `directors` comes from the CSV, re-joined with `", "`; `year` keeps the OMDB
  TV range (`2007–2019`) when stored, else the CSV year. OMDB `N/A` is stored as
  `''`, which also hides the "Directed by N/A" line on `/shelf` for TV series.
- Rewrites `json/movies.json` from the table after each run.
- Ran with the 2026-11-24 IMDb export: 100 → 104 movies (Schindler's List,
  Trai Buon Nguoi, Spider-Man: Brand New Day, Sinbad). Re-runs are no-ops.
- Runbook lives in `AGENTS.md` ("Refreshing movies").
- Open: books (Goodreads RSS/CSV) seeding still not restored.
