'use client'

import { useSearchParams } from 'next/navigation'
import { BookCard } from '~/components/cards/book'
import type { SelectBook } from '~/db/schema'
import { SHELVES, type ShelfType, ShelveSelect } from './shelve-select'

export function BooksList({ books }: { books: SelectBook[] }) {
  let searchParams = useSearchParams()
  let shelf = (searchParams.get('shelf') as ShelfType) || 'all'
  let displayBooks =
    shelf === 'all'
      ? books
      : books.filter((book) => {
          if (shelf === 'read') {
            return book.userShelves === ''
          }
          return book.userShelves?.includes(shelf)
        })
  let { label } = SHELVES.find(({ value }) => value === shelf) || SHELVES[0]

  return (
    <div className="py-5 md:py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <span className="text-xl leading-9 font-bold tracking-tight md:text-2xl">
          <span className="mr-1 capitalize">{label}</span>
          <span className="font-normal">({displayBooks.length})</span>
        </span>
        <div className="flex items-center gap-1 md:gap-2">
          <span>Shelve: </span>
          <ShelveSelect shelf={shelf} />
        </div>
      </div>
      <div className="space-y-10">
        {displayBooks.map((book) => (
          <BookCard key={book.guid} book={book} />
        ))}
      </div>
    </div>
  )
}
