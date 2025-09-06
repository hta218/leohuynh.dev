import {
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'

export let typeEnum = pgEnum('type', ['blog', 'snippet'])

export let statsTable = pgTable(
  'stats',
  {
    type: typeEnum().notNull(),
    slug: varchar({ length: 255 }).notNull(),
    views: integer().notNull().default(0),
    loves: integer().notNull().default(0),
    applauses: integer().notNull().default(0),
    ideas: integer().notNull().default(0),
    bullseyes: integer().notNull().default(0),
  },
  ({ type, slug }) => [primaryKey({ columns: [type, slug] })],
)

export let booksTable = pgTable('books', {
  id: varchar({ length: 255 }).primaryKey().notNull(),
  guid: varchar({ length: 500 }).notNull(),
  pubDate: varchar({ length: 255 }).notNull(),
  title: text().notNull().notNull(),
  link: text().notNull(),
  bookImageUrl: text().notNull(),
  bookSmallImageUrl: text().notNull(),
  bookMediumImageUrl: text().notNull(),
  bookLargeImageUrl: text().notNull(),
  bookDescription: text().notNull(),
  authorName: varchar({ length: 500 }).notNull(),
  isbn: varchar({ length: 50 }),
  userName: varchar({ length: 255 }).notNull(),
  userRating: numeric().notNull(),
  userReadAt: varchar({ length: 255 }),
  userDateAdded: varchar({ length: 255 }).notNull(),
  userDateCreated: varchar({ length: 255 }).notNull(),
  userShelves: varchar({ length: 500 }),
  userReview: text(),
  averageRating: numeric().notNull(),
  bookPublished: varchar({ length: 255 }),
  numPages: integer(),
  content: text().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
})

export let moviesTable = pgTable('movies', {
  id: varchar({ length: 255 }).primaryKey().notNull(),
  yourRating: numeric().notNull(),
  dateRated: varchar({ length: 255 }).notNull(),
  title: text().notNull(),
  originalTitle: text().notNull(),
  url: text().notNull(),
  titleType: varchar({ length: 100 }).notNull(),
  imdbRating: numeric().notNull(),
  runtime: numeric().notNull(),
  year: varchar({ length: 10 }),
  genres: varchar({ length: 500 }).notNull(),
  numVotes: numeric().notNull(),
  releaseDate: varchar({ length: 255 }).notNull(),
  directors: text().notNull(),
  actors: text().notNull(),
  plot: text().notNull(),
  poster: text().notNull(),
  language: varchar({ length: 500 }).notNull(),
  country: varchar({ length: 500 }).notNull(),
  awards: text().notNull(),
  boxOffice: varchar({ length: 100 }),
  totalSeasons: varchar({ length: 10 }),
  ratings: jsonb().$type<Array<{ value: string; source: string }>>().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
})

export let insertBookSchema = createInsertSchema(booksTable)
export let insertMovieSchema = createInsertSchema(moviesTable)

export type StatsType = (typeof typeEnum.enumValues)[number]
export type SelectStats = typeof statsTable.$inferSelect
export type SelectBook = typeof booksTable.$inferSelect
export type InsertBook = typeof booksTable.$inferInsert
export type SelectMovie = typeof moviesTable.$inferSelect
export type InsertMovie = typeof moviesTable.$inferInsert
