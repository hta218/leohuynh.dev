import { genPageMetadata } from '~/app/seo'
import { BookCard } from '~/components/cards/book'
import { Container } from '~/components/ui/container'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import { PageHeader } from '~/components/ui/page-header'
import { SITE_METADATA } from '~/data/site-metadata'
import books from '~/json/books.json' assert { type: 'json' }
import type { GoodreadsBook } from '~/types/data'

export let metadata = genPageMetadata({ title: 'My bookshelf' })

export default async function BooksPage() {
  let readingBooks: GoodreadsBook[] = []
  let readBooks: GoodreadsBook[] = []
  for (let book of books as unknown as GoodreadsBook[]) {
    if (book.user_shelves === 'currently-reading') {
      readingBooks.push(book)
      readingBooks.sort((a, b) => Number(b.user_rating) - Number(a.user_rating))
    } else {
      readBooks.push(book)
      readBooks.sort((a, b) => Number(b.user_rating) - Number(a.user_rating))
    }
  }

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Books"
        description={
          <>
            <p>
              Reading has been my hobby since childhood, starting with comics, magazines, and
              textbooks. Today, I strive to keep reading daily, exploring topics such as science,
              technology, nonfiction, business, education, productivity, and history.
              <br />
              Below is the list of books I've read and am currently reading.
            </p>
            <p className="mt-3 italic">
              *Data sourced from my{' '}
              <Link href={SITE_METADATA.goodreadsBookshelfUrl} className="font-medium">
                <GrowingUnderline data-umami-event="goodreads-feed">
                  Goodreads bookshelf
                </GrowingUnderline>
              </Link>
              .
            </p>
          </>
        }
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="py-5 md:py-10">
        <h3 className="mb-6 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl">
          Currently reading <span className="font-normal">({readingBooks.length})</span>
        </h3>
        <div className="space-y-10">
          {readingBooks.map((book) => (
            <BookCard key={book.guid} book={book} />
          ))}
        </div>
      </div>
      <div className="mt-6 border-t border-gray-200 py-5 dark:border-gray-700 md:mt-10 md:py-10">
        <h3 className="mb-6 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl">
          Finished <span className="font-normal">({readBooks.length})</span>
        </h3>
        <div className="space-y-10">
          {readBooks.map((book) => (
            <BookCard key={book.guid} book={book} />
          ))}
        </div>
      </div>
    </Container>
  )
}
