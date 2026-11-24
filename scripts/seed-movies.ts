#!/usr/bin/env bun
/**
 * Sync the Supabase `movies` table from an IMDb ratings CSV export, then
 * refresh the offline `json/movies.json` snapshot that `src/lib/media.ts`
 * falls back to.
 *
 *   bun run seed:movies ~/Downloads/<imdb-export>.csv
 *
 * Every CSV row is upserted so ratings/votes stay current. OMDB is only called
 * for titles that are new or still missing a poster; other rows keep their
 * stored OMDB columns, so a failed lookup never wipes data. Safe to re-run.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { getSql } from '../src/lib/db'

const SNAPSHOT_PATH = 'json/movies.json'

interface OmdbMovie {
  Response: 'True' | 'False'
  Error?: string
  Year?: string
  Actors?: string
  Plot?: string
  Poster?: string
  Language?: string
  Country?: string
  Awards?: string
  BoxOffice?: string
  totalSeasons?: string
  Ratings?: { Source: string; Value: string }[]
}

// IMDb exports quoted fields with embedded commas, so split on commas only
// outside quotes. `""` inside a quoted field is an escaped quote.
function parseCsv(text: string): Record<string, string>[] {
  let rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    let c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"'
        i++
      } else if (c === '"') quoted = false
      else cell += c
    } else if (c === '"') quoted = true
    else if (c === ',') {
      row.push(cell)
      cell = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += c
  }
  if (cell || row.length) {
    row.push(cell)
    rows.push(row)
  }
  let [header, ...body] = rows.filter((r) => r.length > 1)
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])))
}

// OMDB uses "N/A" for missing values. Every column is NOT NULL, so store ''.
function omdbValue(value: string | undefined): string {
  return value && value !== 'N/A' ? value : ''
}

async function fetchOmdb(id: string, apiKey: string) {
  let res = await fetch(
    `https://www.omdbapi.com/?apikey=${apiKey}&i=${id}&plot=full`,
  )
  let data = (await res.json()) as OmdbMovie
  if (data.Response !== 'True') {
    console.warn(`  ! OMDB lookup failed for ${id}: ${data.Error}`)
    return null
  }
  return {
    year: omdbValue(data.Year),
    actors: omdbValue(data.Actors),
    plot: omdbValue(data.Plot),
    poster: omdbValue(data.Poster),
    language: omdbValue(data.Language),
    country: omdbValue(data.Country),
    awards: omdbValue(data.Awards),
    box_office: omdbValue(data.BoxOffice),
    total_seasons: omdbValue(data.totalSeasons),
    ratings: JSON.stringify(
      (data.Ratings ?? []).map((r) => ({ source: r.Source, value: r.Value })),
    ),
  }
}

async function main() {
  let csvPath = process.argv[2]
  if (!csvPath) throw new Error('Usage: bun run seed:movies <imdb-export.csv>')
  let apiKey = process.env.OMDB_API_KEY
  if (!apiKey) throw new Error('OMDB_API_KEY is not configured in .env.')

  let csv = parseCsv(readFileSync(resolve(csvPath), 'utf-8'))
  let sql = getSql()
  let existing = await sql<Record<string, string>[]>`select * from movies`
  let stored = new Map(existing.map((m) => [m.id, m]))

  let rows: Record<string, string | number | Date | null>[] = []
  for (let m of csv) {
    let id = m.Const
    let prev = stored.get(id)
    let omdb = null
    if (!prev?.poster) {
      console.log(`  + ${m.Title} (${id})`)
      omdb = await fetchOmdb(id, apiKey)
    }
    rows.push({
      actors: '',
      plot: '',
      poster: '',
      language: '',
      country: '',
      awards: '',
      box_office: '',
      total_seasons: null,
      ratings: '[]',
      ...prev,
      ...omdb,
      id,
      your_rating: m['Your Rating'],
      date_rated: m['Date Rated'],
      title: m.Title,
      original_title: m['Original Title'],
      url: m.URL,
      title_type: m['Title Type'],
      imdb_rating: m['IMDb Rating'] || 0,
      runtime: m['Runtime (mins)'] || 0,
      // OMDB keeps TV series ranges ("2007–2019"); the CSV only has the start.
      year: [omdb?.year, prev?.year].find((y) => y?.includes('–')) ?? m.Year,
      genres: m.Genres,
      num_votes: m['Num Votes'] || 0,
      release_date: m['Release Date'],
      // The CSV joins names with a bare comma; match the stored "A, B" form.
      directors: m.Directors.split(',').join(', '),
      updated_at: new Date(),
    })
  }

  let columns: string[] = Object.keys(rows[0]).filter((c) => c !== 'created_at')
  await sql`
    insert into movies ${sql(rows, columns)}
    on conflict (id) do update set
      ${sql.unsafe(
        columns
          .filter((c) => c !== 'id')
          .map((c) => `${c} = excluded.${c}`)
          .join(', '),
      )}
  `

  let snapshot = await sql`
    select * from movies order by date_rated desc
  `
  writeFileSync(
    resolve(process.cwd(), SNAPSHOT_PATH),
    `${JSON.stringify(snapshot, null, 2)}\n`,
  )
  let added = csv.filter((m) => !stored.has(m.Const)).length
  console.log(
    `Synced ${rows.length} movies (${added} new). Snapshot: ${SNAPSHOT_PATH}`,
  )
  await sql.end()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
