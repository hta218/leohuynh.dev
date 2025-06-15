import fs from 'node:fs'
import path from 'node:path'
import csv from 'csv-parser'
import Parser from 'rss-parser'
import { SITE_METADATA } from '~/data/site-metadata'
import { upsertManyBooks, upsertManyMovies } from '~/db/queries'
import type { GoodreadsBook, ImdbMovie, OmdbMovie } from '~/types/data'

let parser = new Parser<{ [key: string]: unknown }, GoodreadsBook>({
  customFields: {
    item: [
      'guid',
      'pubDate',
      'title',
      'link',
      'book_id',
      'book_image_url',
      'book_small_image_url',
      'book_medium_image_url',
      'book_large_image_url',
      'book_description',
      'author_name',
      'isbn',
      'user_name',
      'user_rating',
      'user_read_at',
      'user_date_added',
      'user_date_created',
      'user_shelves',
      'user_review',
      'average_rating',
      'book_published',
    ],
  },
})

export async function fetchGoodreadsBooks() {
  if (SITE_METADATA.goodreadsFeedUrl) {
    try {
      console.log('Parsing Goodreads RSS feed...')
      let data = await parser.parseURL(SITE_METADATA.goodreadsFeedUrl)
      for (let book of data.items) {
        book.book_description = book.book_description
          .replace(/<[^>]*(>|$)/g, '')
          .replace(/\s\s+/g, ' ')
          .replace(/^["|"]|["|"]$/g, '')
          .replace(/\.([a-zA-Z0-9])/g, '. $1')
        book.content = book.content.replace(/\n/g, '').replace(/\s\s+/g, ' ')
      }
      try {
        let savedBooks = await upsertManyBooks(data.items)
        console.log(`📚 ${savedBooks.length} books saved to database.`)
      } catch (error) {
        console.error(`❌ Error saving books to database: ${error.message}`)
      }
    } catch (error) {
      console.error(`Error fetching the Goodreads RSS feed: ${error.message}`)
    }
  } else {
    console.log('📚 No Goodreads RSS feed found.')
  }
}

const IMDB_CSV_FILE_PATH = path.join(process.cwd(), 'scripts', 'imdb-movies.csv')
async function fetchImdbMovies() {
  console.log('Processing IMDB movies...')
  if (!fs.existsSync(IMDB_CSV_FILE_PATH)) {
    console.log('🎬 IMDB CSV file not found.')
    return
  }
  if (!process.env.OMDB_API_KEY) {
    console.log('🎬 No OMDB API key provided.')
    console.log(
      '💡 Try re-running the `seed` script with `OMDB_API_KEY=<your-api-key> npm run seed`.'
    )
    return
  }
  try {
    let imdbMovies: ImdbMovie[] = []
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(IMDB_CSV_FILE_PATH)
        .pipe(
          csv({
            mapHeaders: ({ header }) =>
              header
                .replace(/(\(.*\))/g, '')
                .trim()
                .toLowerCase()
                .replace(/\s/g, '_'),
          })
        )
        .on('data', async (mv: ImdbMovie) => {
          imdbMovies.push(mv)
        })
        .on('error', (error) => {
          console.error(`Error parsing IMDB CSV file: ${error.message}`)
          reject(error)
        })
        .on('end', async () => {
          try {
            let movies: ImdbMovie[] = []
            await Promise.all(
              imdbMovies.map(async (mv) => {
                let res = await fetch(
                  `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${mv.const}&plot=full`,
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }
                )
                let omdbMovie: OmdbMovie = await res.json()
                movies.push({
                  ...mv,
                  total_seasons: omdbMovie.totalSeasons,
                  year: omdbMovie.Year,
                  actors: omdbMovie.Actors,
                  plot: omdbMovie.Plot,
                  poster: omdbMovie.Poster,
                  language: omdbMovie.Language,
                  country: omdbMovie.Country,
                  awards: omdbMovie.Awards,
                  box_office: omdbMovie.BoxOffice,
                  ratings: omdbMovie.Ratings.map((r) => ({
                    source: r.Source,
                    value: r.Value,
                  })),
                })
              })
            )

            // Save movies to database in a single query
            try {
              let savedMovies = await upsertManyMovies(movies)
              console.log(`🎬 ${savedMovies.length} movies saved to database.`)
            } catch (error) {
              console.error(`❌ Error saving movies to database: ${error.message}`)
            }
            resolve()
          } catch (error) {
            reject(error)
          }
        })
    })
  } catch (error) {
    console.error(`Error parsing IMDB CSV file: ${error.message}`)
  }
}

export async function seed() {
  await fetchImdbMovies()
  await fetchGoodreadsBooks()
}

seed()
  .then(() => {
    console.log('🌱 The seed command has finished successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
