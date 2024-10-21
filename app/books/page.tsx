import { Suspense } from 'react'
import { genPageMetadata } from '~/app/seo'
import { Container } from '~/components/ui/container'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Image, Zoom } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { PageHeader } from '~/components/ui/page-header'
import { SITE_METADATA } from '~/data/site-metadata'
import books from '~/json/books.json' assert { type: 'json' }
import type { GoodreadsBook } from '~/types/data'
import { BooksList } from './books-list'

export let metadata = genPageMetadata({ title: 'My bookshelf' })

export default async function BooksPage() {
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
              This is where I keep track of what I’ve read and what’s on my reading list.
            </p>
            <p className="mt-3 italic">
              *Data pulled from my{' '}
              <Link href={SITE_METADATA.goodreadsBookshelfUrl} className="font-medium">
                <GrowingUnderline data-umami-event="goodreads-feed" active>
                  Goodreads bookshelf
                </GrowingUnderline>
              </Link>
              .
            </p>
          </>
        }
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <Suspense>
        <BooksList
          books={
            books.sort(
              (a, b) => Number(b.user_rating) - Number(a.user_rating)
            ) as unknown as GoodreadsBook[]
          }
        />
      </Suspense>
      <div className="mt-6 border-t border-gray-200 py-5 dark:border-gray-700 md:mt-10 md:py-10">
        <h3 className="mb-6 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl">
          FYI
        </h3>
        <div className="space-y-4">
          <p>My real life bookshelf and working space.</p>
          <Zoom>
            <Image
              src="/static/images/working-space.jpg"
              alt="Bookshelf and working space"
              width={1600}
              height={1200}
              className="rounded-2xl object-cover object-center"
            />
          </Zoom>
        </div>
      </div>
    </Container>
  )
}
