import { and, eq, sql } from 'drizzle-orm'
import type { GoodreadsBook, ImdbMovie } from '~/types/data'
import { db } from './index'
import {
  type InsertBook,
  type InsertMovie,
  type SelectBook,
  type SelectMovie,
  type SelectStats,
  type StatsType,
  booksTable,
  moviesTable,
  statsTable,
} from './schema'

export async function getBlogStats(type: StatsType, slug: string) {
  let stats = await db
    .select()
    .from(statsTable)
    .where(and(eq(statsTable.type, type), eq(statsTable.slug, slug)))
  if (stats.length) {
    return stats[0]
  }
  let newStats = await db.insert(statsTable).values({ type, slug }).returning()
  return newStats[0]
}

export async function updateBlogStats(
  type: StatsType,
  slug: string,
  updates: Omit<SelectStats, 'type' | 'slug'>
) {
  let currentStats = await getBlogStats(type, slug)

  // Safeguard against negative updates
  for (let key in updates) {
    if (typeof updates[key] === 'number' && updates[key] < currentStats[key]) {
      updates[key] = currentStats[key]
    }
  }

  let updatedStats = await db
    .update(statsTable)
    .set(updates)
    .where(and(eq(statsTable.type, type), eq(statsTable.slug, slug)))
    .returning()
  return updatedStats[0]
}

export async function upsertBook(bookData: GoodreadsBook): Promise<SelectBook> {
  let book: InsertBook = {
    id: bookData.book_id,
    guid: bookData.guid,
    pubDate: bookData.pubDate,
    title: bookData.title,
    link: bookData.link,
    bookImageUrl: bookData.book_image_url,
    bookSmallImageUrl: bookData.book_small_image_url,
    bookMediumImageUrl: bookData.book_medium_image_url,
    bookLargeImageUrl: bookData.book_large_image_url,
    bookDescription: bookData.book_description,
    authorName: bookData.author_name,
    isbn: bookData.isbn,
    userName: bookData.user_name,
    userRating: bookData.user_rating,
    userReadAt: bookData.user_read_at,
    userDateAdded: bookData.user_date_added,
    userDateCreated: bookData.user_date_created,
    userShelves: bookData.user_shelves,
    userReview: bookData.user_review,
    averageRating: bookData.average_rating.toString(),
    bookPublished: bookData.book_published,
    content: bookData.content,
    updatedAt: new Date(),
  }

  let result = await db
    .insert(booksTable)
    .values(book)
    .onConflictDoUpdate({
      target: booksTable.id,
      set: {
        ...book,
        updatedAt: new Date(),
      },
    })
    .returning()

  return result[0]
}

export async function upsertMovie(movieData: ImdbMovie): Promise<SelectMovie> {
  let movie: InsertMovie = {
    id: movieData.const,
    yourRating: movieData.your_rating,
    dateRated: movieData.date_rated,
    title: movieData.title,
    originalTitle: movieData.original_title,
    url: movieData.url,
    titleType: movieData.title_type,
    imdbRating: movieData.imdb_rating,
    runtime: movieData.runtime,
    year: movieData.year,
    genres: movieData.genres,
    numVotes: movieData.num_votes,
    releaseDate: movieData.release_date,
    directors: movieData.directors,
    actors: movieData.actors,
    plot: movieData.plot,
    poster: movieData.poster,
    language: movieData.language,
    country: movieData.country,
    awards: movieData.awards,
    boxOffice: movieData.box_office,
    totalSeasons: movieData.total_seasons,
    ratings: movieData.ratings,
    updatedAt: new Date(),
  }

  let result = await db
    .insert(moviesTable)
    .values(movie)
    .onConflictDoUpdate({
      target: moviesTable.id,
      set: {
        ...movie,
        updatedAt: new Date(),
      },
    })
    .returning()

  return result[0]
}

export async function upsertManyBooks(booksData: GoodreadsBook[]): Promise<SelectBook[]> {
  if (booksData.length === 0) return []

  let books: InsertBook[] = booksData.map((bookData) => ({
    id: bookData.book_id,
    guid: bookData.guid,
    pubDate: bookData.pubDate,
    title: bookData.title,
    link: bookData.link,
    bookImageUrl: bookData.book_image_url,
    bookSmallImageUrl: bookData.book_small_image_url,
    bookMediumImageUrl: bookData.book_medium_image_url,
    bookLargeImageUrl: bookData.book_large_image_url,
    bookDescription: bookData.book_description,
    authorName: bookData.author_name,
    isbn: bookData.isbn,
    userName: bookData.user_name,
    userRating: bookData.user_rating,
    userReadAt: bookData.user_read_at,
    userDateAdded: bookData.user_date_added,
    userDateCreated: bookData.user_date_created,
    userShelves: bookData.user_shelves,
    userReview: bookData.user_review,
    averageRating: bookData.average_rating.toString(),
    bookPublished: bookData.book_published,
    content: bookData.content,
    updatedAt: new Date(),
  }))

  let result = await db
    .insert(booksTable)
    .values(books)
    .onConflictDoUpdate({
      target: booksTable.id,
      set: {
        guid: sql.raw('excluded.guid'),
        pubDate: sql.raw('excluded.pub_date'),
        title: sql.raw('excluded.title'),
        link: sql.raw('excluded.link'),
        bookImageUrl: sql.raw('excluded.book_image_url'),
        bookSmallImageUrl: sql.raw('excluded.book_small_image_url'),
        bookMediumImageUrl: sql.raw('excluded.book_medium_image_url'),
        bookLargeImageUrl: sql.raw('excluded.book_large_image_url'),
        bookDescription: sql.raw('excluded.book_description'),
        authorName: sql.raw('excluded.author_name'),
        isbn: sql.raw('excluded.isbn'),
        userName: sql.raw('excluded.user_name'),
        userRating: sql.raw('excluded.user_rating'),
        userReadAt: sql.raw('excluded.user_read_at'),
        userDateAdded: sql.raw('excluded.user_date_added'),
        userDateCreated: sql.raw('excluded.user_date_created'),
        userShelves: sql.raw('excluded.user_shelves'),
        userReview: sql.raw('excluded.user_review'),
        averageRating: sql.raw('excluded.average_rating'),
        bookPublished: sql.raw('excluded.book_published'),
        content: sql.raw('excluded.content'),
        updatedAt: new Date(),
      },
    })
    .returning()

  return result
}

export async function upsertManyMovies(moviesData: ImdbMovie[]): Promise<SelectMovie[]> {
  if (moviesData.length === 0) return []

  let movies: InsertMovie[] = moviesData.map((movieData) => ({
    id: movieData.const,
    yourRating: movieData.your_rating,
    dateRated: movieData.date_rated,
    title: movieData.title,
    originalTitle: movieData.original_title,
    url: movieData.url,
    titleType: movieData.title_type,
    imdbRating: movieData.imdb_rating,
    runtime: movieData.runtime,
    year: movieData.year,
    genres: movieData.genres,
    numVotes: movieData.num_votes,
    releaseDate: movieData.release_date,
    directors: movieData.directors,
    actors: movieData.actors,
    plot: movieData.plot,
    poster: movieData.poster,
    language: movieData.language,
    country: movieData.country,
    awards: movieData.awards,
    boxOffice: movieData.box_office,
    totalSeasons: movieData.total_seasons,
    ratings: movieData.ratings,
    updatedAt: new Date(),
  }))

  let result = await db
    .insert(moviesTable)
    .values(movies)
    .onConflictDoUpdate({
      target: moviesTable.id,
      set: {
        yourRating: sql.raw('excluded.your_rating'),
        dateRated: sql.raw('excluded.date_rated'),
        title: sql.raw('excluded.title'),
        originalTitle: sql.raw('excluded.original_title'),
        url: sql.raw('excluded.url'),
        titleType: sql.raw('excluded.title_type'),
        imdbRating: sql.raw('excluded.imdb_rating'),
        runtime: sql.raw('excluded.runtime'),
        year: sql.raw('excluded.year'),
        genres: sql.raw('excluded.genres'),
        numVotes: sql.raw('excluded.num_votes'),
        releaseDate: sql.raw('excluded.release_date'),
        directors: sql.raw('excluded.directors'),
        actors: sql.raw('excluded.actors'),
        plot: sql.raw('excluded.plot'),
        poster: sql.raw('excluded.poster'),
        language: sql.raw('excluded.language'),
        country: sql.raw('excluded.country'),
        awards: sql.raw('excluded.awards'),
        boxOffice: sql.raw('excluded.box_office'),
        totalSeasons: sql.raw('excluded.total_seasons'),
        ratings: sql.raw('excluded.ratings'),
        updatedAt: new Date(),
      },
    })
    .returning()

  return result
}

export async function getAllBooks(): Promise<SelectBook[]> {
  return await db.select().from(booksTable).orderBy(booksTable.userReadAt)
}

export async function getAllMovies(): Promise<SelectMovie[]> {
  return await db.select().from(moviesTable).orderBy(moviesTable.dateRated)
}

export async function getBookById(id: string): Promise<SelectBook | undefined> {
  let books = await db.select().from(booksTable).where(eq(booksTable.id, id))
  return books[0]
}

export async function getMovieById(id: string): Promise<SelectMovie | undefined> {
  let movies = await db.select().from(moviesTable).where(eq(moviesTable.id, id))
  return movies[0]
}
