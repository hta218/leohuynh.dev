import csv from 'csv-parser'
import fs, { writeFileSync } from 'fs'
import path from 'path'
import Parser from 'rss-parser'
import { SITE_METADATA } from '~/data/site-metadata'
import type { GoodreadsBook, ImdbMovie, OmdbMovie } from '~/types/data'

let parser = new Parser<{ [key: string]: any }, GoodreadsBook>({
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
      let data = await parser.parseURL(SITE_METADATA.goodreadsFeedUrl)
      for (let book of data.items) {
        book.book_description = book.book_description
          .replace(/<[^>]*(>|$)/g, '')
          .replace(/\s\s+/g, ' ')
          .replace(/^["|“]|["|“]$/g, '')
          .replace(/\.([a-zA-Z0-9])/g, '. $1')
        book.content = book.content.replace(/\n/g, '').replace(/\s\s+/g, ' ')
      }
      writeFileSync(`./json/books.json`, JSON.stringify(data.items))
      console.log('📚 Books seeded.')
    } catch (error) {
      console.error(`Error fetching the Goodreads RSS feed: ${error.message}`)
    }
  } else {
    console.log('📚 No Goodreads RSS feed found.')
  }
}

const IMDB_CSV_FILE_PATH = path.join(process.cwd(), 'scripts', 'imdb-movies.csv')
async function fetchImdbMovies() {
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
      })
      .on('end', async () => {
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
        writeFileSync(`./json/movies.json`, JSON.stringify(movies))
        console.log('🎬 IMDB movies seeded.')
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
