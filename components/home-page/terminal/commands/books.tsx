'use client'

import { useEffect, useState } from 'react'
import { TerminalLoading } from '~/components/ui/terminal-loading'

interface Book {
  title: string
  author: string
  rating: string
  averageRating: string
  link: string
  bookImageUrl: string
  userReadAt: string | null
}

interface GroupedBooks {
  [shelf: string]: Book[]
}

export function BooksCommand() {
  let [loading, setLoading] = useState(true)
  let [books, setBooks] = useState<GroupedBooks>({})
  let [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  async function fetchBooks() {
    try {
      let response = await fetch('/api/books')
      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }
      let data = await response.json()
      setBooks(data.books)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <TerminalLoading text="fetching books..." />
  }

  if (error) {
    return <div data-terminal-error>Error: {error}</div>
  }

  let shelves = Object.keys(books).sort((a, b) => {
    // Priority order for shelves
    let priority = [
      'currently-reading',
      'read',
      'to-read',
      'english',
      'paused',
      'abandoned',
    ]
    let aIndex = priority.indexOf(a)
    let bIndex = priority.indexOf(b)

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return a.localeCompare(b)
  })

  return (
    <div className="space-y-4">
      <p>
        Reading has been my hobby since childhood, starting with comics,
        magazines, and textbooks. Today, I strive to keep reading daily,
        exploring topics such as science, technology, nonfiction, business,
        education, productivity, and history.
        <br />
        This is where I keep track of what I’ve read and what’s on my reading
        list.
      </p>

      {shelves.map((shelf) => (
        <div key={shelf} className="space-y-2">
          <div>
            {shelf.charAt(0).toUpperCase() + shelf.slice(1).replace(/-/g, ' ')}{' '}
            ({books[shelf].length})
          </div>

          <div className="pl-4 space-y-1.5">
            {books[shelf].map((book, index) => (
              <div key={index} className="flex flex-col space-y-1">
                <div className="flex items-start space-x-2">
                  <span>•</span>
                  <div className="flex-1">
                    <a
                      href={book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline underline-offset-4"
                    >
                      <strong>{book.title}</strong>
                    </a>
                    <span data-terminal-info> by {book.author}</span>
                  </div>
                </div>
                <div className="pl-5 text-sm" data-terminal-info>
                  {book.rating !== '0' && <span>My rate: {book.rating}/5</span>}
                  {book.rating !== '0' && book.averageRating !== '0' && (
                    <span> | </span>
                  )}
                  {book.averageRating !== '0' && (
                    <span>
                      Avg on goodreads: {Number(book.averageRating).toFixed(2)}
                    </span>
                  )}
                  {book.userReadAt && (
                    <span>
                      {' '}
                      | Read: {new Date(book.userReadAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
