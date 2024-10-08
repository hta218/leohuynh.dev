'use client'

import { useState } from 'react'
import { BookCard } from '~/components/cards/book'
import type { GoodreadsBook } from '~/types/data'
import { SHELVES, ShelveSelect, type ShelfType } from './shelve-select'

export function BooksList({ books }: { books: GoodreadsBook[] }) {
  let [shelf, setShelf] = useState<ShelfType>('all')
  let displayBooks =
    shelf === 'all'
      ? books
      : books.filter((book) => {
          if (shelf === 'read') {
            return book.user_shelves === ''
          }
          return book.user_shelves.includes(shelf)
        })
  let { label } = SHELVES.find(({ value }) => value === shelf) || SHELVES[0]

  return (
    <div className="py-5 md:py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <span className="text-xl font-bold leading-9 tracking-tight md:text-2xl">
          <span className="mr-1 capitalize">{label}</span>
          <span className="font-normal">({displayBooks.length})</span>
        </span>
        <div className="flex items-center gap-1 md:gap-2">
          <span>Shelve: </span>
          <ShelveSelect shelf={shelf} setShelf={setShelf} />
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
