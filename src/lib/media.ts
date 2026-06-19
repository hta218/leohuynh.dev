import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { getSql } from '~/lib/db'

/**
 * Loaders for `/books` and `/movies`. Reads the live Supabase tables (`books`
 * from Goodreads RSS, `movies` from IMDb + OMDB) so the shelf and the home-page
 * activity rail stay current. If the DB is unreachable (e.g. an offline build
 * with no `DATABASE_URL`), it falls back to the legacy cached snapshots in
 * `json/books.json` / `json/movies.json` so pages still render.
 */

export interface Book {
  title: string
  link: string
  guid: string
  bookId: string
  imageUrl: string
  description: string
  authorName: string
  userRating: number
  userShelves: string
  averageRating: number
}

export interface Movie {
  id: string
  title: string
  url: string
  titleType: 'Movie' | 'TV Series' | 'TV Mini Series'
  yourRating: number
  imdbRating: number
  dateRated: string
  year: string
  genres: string
  directors: string
  poster: string
  plot: string
  runtime: number
}

function mapBook(b: Record<string, unknown>): Book {
  const str = (v: unknown) => (v == null ? '' : String(v))
  return {
    title: str(b.title),
    link: str(b.link),
    guid: str(b.guid),
    bookId: str(b.id ?? b.book_id),
    imageUrl: str(
      b.book_large_image_url || b.book_medium_image_url || b.book_image_url,
    ),
    description: str(b.book_description),
    authorName: str(b.author_name),
    userRating: Number(b.user_rating ?? 0),
    userShelves: str(b.user_shelves),
    averageRating: Number(b.average_rating ?? 0),
  }
}

function mapMovie(m: Record<string, unknown>): Movie {
  const str = (v: unknown) => (v == null ? '' : String(v))
  return {
    id: str(m.id ?? m.const),
    title: str(m.title),
    url: str(m.url),
    titleType: (str(m.title_type) as Movie['titleType']) || 'Movie',
    yourRating: Number(m.your_rating ?? 0),
    imdbRating: Number(m.imdb_rating ?? 0),
    dateRated: str(m.date_rated),
    year: str(m.year),
    genres: str(m.genres),
    directors: str(m.directors),
    poster: str(m.poster),
    plot: str(m.plot),
    runtime: Number(m.runtime ?? 0),
  }
}

function readJson(relPath: string): Record<string, unknown>[] {
  try {
    const file = resolve(process.cwd(), relPath)
    return JSON.parse(readFileSync(file, 'utf-8')) as Record<string, unknown>[]
  } catch {
    return []
  }
}

export async function getBooks(): Promise<Book[]> {
  try {
    const sql = getSql()
    const rows = await sql<Record<string, unknown>[]>`
      select * from books
    `
    return rows.map(mapBook)
  } catch (error) {
    console.error('[lib/media] getBooks falling back to snapshot', error)
    return readJson('json/books.json').map(mapBook)
  }
}

export async function getMovies(): Promise<Movie[]> {
  try {
    const sql = getSql()
    const rows = await sql<Record<string, unknown>[]>`
      select * from movies
    `
    return rows.map(mapMovie)
  } catch (error) {
    console.error('[lib/media] getMovies falling back to snapshot', error)
    return readJson('json/movies.json').map(mapMovie)
  }
}

/**
 * Targeted readers for the home-page activity rail. Unlike getBooks/getMovies
 * they fetch only the few rows the rail needs (currently-reading shelf, latest
 * rated movie) instead of the whole table, so the rail stays light.
 */
export async function getCurrentlyReading(): Promise<Book[]> {
  try {
    const sql = getSql()
    const rows = await sql<Record<string, unknown>[]>`
      select * from books where user_shelves like '%currently-reading%'
    `
    return rows.map(mapBook)
  } catch (error) {
    console.error('[lib/media] getCurrentlyReading falling back to snapshot', error)
    return readJson('json/books.json')
      .map(mapBook)
      .filter((book) => book.userShelves.includes('currently-reading'))
  }
}

export async function getLatestWatched(): Promise<Movie | null> {
  try {
    const sql = getSql()
    const rows = await sql<Record<string, unknown>[]>`
      select * from movies order by date_rated desc limit 1
    `
    return rows.length ? mapMovie(rows[0]) : null
  } catch (error) {
    console.error('[lib/media] getLatestWatched falling back to snapshot', error)
    const movies = readJson('json/movies.json').map(mapMovie)
    return (
      movies.sort((a, b) => b.dateRated.localeCompare(a.dateRated))[0] ?? null
    )
  }
}
