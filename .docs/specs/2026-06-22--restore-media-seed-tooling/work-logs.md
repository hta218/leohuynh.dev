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
