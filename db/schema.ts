import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export let typeEnum = pgEnum('type', ['blog', 'snippet'])

export let statsTable = pgTable(
  'stats',
  {
    type: typeEnum().notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    views: integer('views').notNull().default(0),
    loves: integer('loves').notNull().default(0),
    applauses: integer('applauses').notNull().default(0),
    ideas: integer('ideas').notNull().default(0),
    bullseyes: integer('bullseyes').notNull().default(0),
  },
  ({ type, slug }) => [primaryKey({ columns: [type, slug] })]
)

export let booksTable = pgTable('books', {
  id: varchar('id', { length: 255 }).primaryKey(), // Using book_id as primary key
  guid: varchar('guid', { length: 500 }),
  pubDate: varchar('pub_date', { length: 255 }),
  title: text('title').notNull(),
  link: text('link'),
  bookImageUrl: text('book_image_url'),
  bookSmallImageUrl: text('book_small_image_url'),
  bookMediumImageUrl: text('book_medium_image_url'),
  bookLargeImageUrl: text('book_large_image_url'),
  bookDescription: text('book_description'),
  authorName: varchar('author_name', { length: 500 }),
  isbn: varchar('isbn', { length: 50 }),
  userName: varchar('user_name', { length: 255 }),
  userRating: varchar('user_rating', { length: 10 }),
  userReadAt: varchar('user_read_at', { length: 255 }),
  userDateAdded: varchar('user_date_added', { length: 255 }),
  userDateCreated: varchar('user_date_created', { length: 255 }),
  userShelves: varchar('user_shelves', { length: 500 }),
  userReview: text('user_review'),
  averageRating: varchar('average_rating', { length: 10 }),
  bookPublished: varchar('book_published', { length: 255 }),
  content: text('content'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export let moviesTable = pgTable('movies', {
  id: varchar('id', { length: 255 }).primaryKey(), // Using const as primary key
  yourRating: varchar('your_rating', { length: 10 }),
  dateRated: varchar('date_rated', { length: 255 }),
  title: text('title').notNull(),
  originalTitle: text('original_title'),
  url: text('url'),
  titleType: varchar('title_type', { length: 100 }),
  imdbRating: varchar('imdb_rating', { length: 10 }),
  runtime: varchar('runtime', { length: 50 }),
  year: varchar('year', { length: 10 }),
  genres: varchar('genres', { length: 500 }),
  numVotes: varchar('num_votes', { length: 50 }),
  releaseDate: varchar('release_date', { length: 255 }),
  directors: text('directors'),
  actors: text('actors'),
  plot: text('plot'),
  poster: text('poster'),
  language: varchar('language', { length: 500 }),
  country: varchar('country', { length: 500 }),
  awards: text('awards'),
  boxOffice: varchar('box_office', { length: 100 }),
  totalSeasons: varchar('total_seasons', { length: 10 }),
  ratings: jsonb('ratings'), // Store ratings array as JSONB
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type StatsType = (typeof typeEnum.enumValues)[number]
export type SelectStats = typeof statsTable.$inferSelect
export type SelectBook = typeof booksTable.$inferSelect
export type InsertBook = typeof booksTable.$inferInsert
export type SelectMovie = typeof moviesTable.$inferSelect
export type InsertMovie = typeof moviesTable.$inferInsert
