import Parser from 'rss-parser'
import { writeFileSync } from 'fs'
import { SITE_METADATA } from '~/data/site-metadata'
import type { GoodreadsBook } from '~/types/data'

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
          .replace(/^["|“]/g, '')
          .replace(/\.([a-zA-Z0-9])/g, '. $1')
        book.content = book.content.replace(/\n/g, '').replace(/\s\s+/g, ' ')
      }
      writeFileSync(`./json/books.json`, JSON.stringify(data.items))
      console.log('📚 Books seeded.')
    } catch (error) {
      console.error(`Error fetching the Goodread RSS feed: ${error.message}`)
    }
  }
}

export async function seed() {
  await fetchGoodreadsBooks()
}

seed()
