import { NextResponse } from 'next/server'
import { db } from '~/db'
import { booksTable } from '~/db/schema'

interface BookItem {
  title: string
  author: string
  rating: string
  averageRating: string
  link: string
  bookImageUrl: string
  userReadAt: string | null
}

export async function GET() {
  try {
    let books = await db
      .select()
      .from(booksTable)
      .orderBy(booksTable.userDateAdded)

    // Group books by shelves/status
    let groupedBooks = books.reduce(
      (acc, book) => {
        let shelves = book.userShelves || 'uncategorized'

        // Parse shelves (they might be comma-separated)
        let shelfList = shelves
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)

        // If a bookshelf contains 'currently-reading', and other shelves, remove 'currently-reading'
        if (shelfList.includes('currently-reading') && shelfList.length > 1) {
          shelfList = shelfList.filter((s) => s !== 'currently-reading')
        }

        let bookItem: BookItem = {
          title: book.title,
          author: book.authorName,
          rating: book.userRating,
          averageRating: book.averageRating,
          link: book.link,
          bookImageUrl: book.bookSmallImageUrl,
          userReadAt: book.userReadAt,
        }

        // Add book to each shelf it belongs to
        for (let shelf of shelfList) {
          if (!acc[shelf]) {
            acc[shelf] = []
          }
          acc[shelf].push(bookItem)
        }

        // If no shelves, add to uncategorized
        if (shelfList.length === 0) {
          if (!acc.uncategorized) {
            acc.uncategorized = []
          }
          acc.uncategorized.push(bookItem)
        }

        return acc
      },
      {} as Record<string, BookItem[]>,
    )

    return NextResponse.json({ books: groupedBooks })
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 },
    )
  }
}
