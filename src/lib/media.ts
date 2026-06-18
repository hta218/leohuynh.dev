import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Build-time loaders for `/books` and `/movies`. Reads the legacy cached exports
 * (`json/books.json` from Goodreads RSS, `json/movies.json` from IMDb + OMDB) so
 * the pages stay fully static — no DB/Supabase access during the v4 build.
 *
 * At cutover these can be swapped for a Drizzle query if live data is wanted;
 * the shapes below mirror the cached snapshot field names (snake_case).
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
  year: string
  genres: string
  directors: string
  poster: string
  plot: string
  runtime: number
}

function readJson<T>(relPath: string): T[] {
  try {
    const file = resolve(process.cwd(), relPath)
    return JSON.parse(readFileSync(file, 'utf-8')) as T[]
  } catch {
    // Graceful fallback — page renders its empty state if the snapshot is missing.
    return []
  }
}

export function getBooks(): Book[] {
  const raw = readJson<Record<string, string>>('json/books.json')
  return raw.map((b) => ({
    title: b.title,
    link: b.link,
    guid: b.guid,
    bookId: b.book_id,
    imageUrl:
      b.book_large_image_url || b.book_medium_image_url || b.book_image_url,
    description: b.book_description ?? '',
    authorName: b.author_name ?? '',
    userRating: Number(b.user_rating ?? 0),
    userShelves: b.user_shelves ?? '',
    averageRating: Number(b.average_rating ?? 0),
  }))
}

export function getMovies(): Movie[] {
  const raw = readJson<Record<string, string>>('json/movies.json')
  return raw.map((m) => ({
    id: m.const,
    title: m.title,
    url: m.url,
    titleType: (m.title_type as Movie['titleType']) ?? 'Movie',
    yourRating: Number(m.your_rating ?? 0),
    imdbRating: Number(m.imdb_rating ?? 0),
    year: m.year ?? '',
    genres: m.genres ?? '',
    directors: m.directors ?? '',
    poster: m.poster ?? '',
    plot: m.plot ?? '',
    runtime: Number(m.runtime ?? 0),
  }))
}
