'use client'

import { BookCard } from '~/components/cards/book'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import type { SelectBook } from '~/db/schema'

export function BooksList({ books }: { books: SelectBook[] }) {
  let currentlyReading = books.filter(
    (book) => book.userShelves === 'currently-reading',
  )
  let otherBooks = books.filter(
    (book) => book.userShelves !== 'currently-reading',
  )

  return (
    <div className="py-5 md:py-10 space-y-16">
      {currentlyReading.length > 0 && (
        <>
          <div className="space-y-8">
            <h3 className="text-xl leading-9 font-bold tracking-tight md:text-2xl">
              Currently Reading
            </h3>
            <BookCard book={currentlyReading[0]} />
          </div>
          {currentlyReading.length > 1 && (
            <div className="mb-8">
              <ul className="space-y-4">
                {currentlyReading.slice(1).map((book) => (
                  <BookListItem key={book.guid} book={book} />
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <div className="w-1/3 mx-auto border-t border-gray-200 dark:border-gray-700 my-6" />

      {otherBooks.length > 0 && (
        <div className="space-y-8">
          <h3 className="text-xl leading-9 font-bold tracking-tight md:text-2xl">
            Other Books
          </h3>
          <ul className="space-y-6">
            {otherBooks.map((book) => (
              <BookListItem key={book.guid} book={book} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function BookListItem({ book }: { book: SelectBook }) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getShelfLabel = (shelf: string | null) => {
    if (!shelf) return null
    switch (shelf) {
      case 'currently-reading':
        return 'Currently reading'
      case 'read':
        return 'Read'
      default:
        return shelf.replace('-', ' ')
    }
  }

  return (
    <li className="flex items-start gap-3 rounded-lg">
      <Image
        src={book.bookMediumImageUrl}
        alt={book.title}
        width={40}
        height={60}
        className="object-cover rounded-r-md shadow-sm border border-gray-200 dark:border-gray-700"
      />
      <div className="flex-1 min-w-0 flex justify-between gap-4">
        <div className="space-y-1">
          {/* Title with shelf status */}
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-lg">
              {book.link ? (
                <Link href={book.link} className="hover:underline">
                  {book.title}
                </Link>
              ) : (
                book.title
              )}
            </h4>
            {book.userShelves && (
              <span className="inline-block px-2 py-0.5 text-sm font-medium rounded-full bg-gray-200 dark:bg-gray-700">
                {getShelfLabel(book.userShelves)}
              </span>
            )}
          </div>

          {/* Author */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            by {book.authorName}
          </p>
        </div>

        {/* Right side info */}
        <div className="flex flex-col items-end justify-start gap-1 text-sm text-gray-500 dark:text-gray-400">
          {book.bookPublished && <span>published {book.bookPublished}</span>}
          {book.numPages && <span>{book.numPages} pages</span>}
          {book.userRating && Number(book.userRating) > 0 && (
            <span>avg {book.averageRating}/5</span>
          )}
        </div>
      </div>
    </li>
  )
}
