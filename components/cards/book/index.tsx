import { GradientBorder } from '~/components/ui/gradient-border'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import { Rating } from '~/components/ui/rating'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import { Twemoji } from '~/components/ui/twemoji'
import type { SelectBook } from '~/db/schema'
import GoodreadsLogo from '~/icons/goodreads-big.svg'
import { BookCover } from './book-cover'
import { BookDetails } from './book-details'

export function BookCard({ book }: { book: SelectBook }) {
  return (
    <GradientBorder className="flex flex-col gap-8 rounded-2xl px-3 py-6 md:flex-row md:px-6 dark:bg-white/5">
      <TiltedGridBackground className="inset-0 z-[-1]" />
      <div className="mx-auto flex w-60 shrink-0 items-center justify-center">
        <BookCover image={book.bookLargeImageUrl} alt={book.title} />
      </div>
      <div className="flex grow flex-col justify-between gap-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-12 text-xl font-semibold md:text-2xl">
              {book.link ? (
                <Link href={book.link}>
                  <GrowingUnderline>{book.title}</GrowingUnderline>
                </Link>
              ) : (
                <h3>{book.title}</h3>
              )}
              <Rating
                rating={book.userRating}
                className="hidden md:inline-flex"
              />
            </div>
          </div>
          <BookDetails book={book} />
        </div>
        <div className="flex items-center justify-between">
          <BookMeta book={book} />
          <GoodreadsLink url={getBookUrl(book.content)} />
        </div>
      </div>
    </GradientBorder>
  )
}

function BookMeta({ book }: { book: SelectBook }) {
  return (
    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-1">
        <Twemoji emoji="writing-hand" /> by{' '}
        <span className="font-semibold">{book.authorName}</span>
      </div>
      <div className="hidden items-center gap-1 md:flex">
        <span>(avg. {book.averageRating}/5)</span>
      </div>
    </div>
  )
}

function GoodreadsLink({
  url,
  className,
}: { url?: string | null; className?: string }) {
  if (url) {
    return (
      <Link href={url} className={className}>
        <GoodreadsLogo className="text-goodreads h-5 dark:text-gray-100" />
      </Link>
    )
  }
  return null
}

function getBookUrl(content: string) {
  try {
    let url = content.match(/<a href="([^"]*)">/)?.[1]?.split('?')[0]
    return url
  } catch (error) {
    console.error('Error parsing book URL:', error)
    return null
  }
}
