import clsx from 'clsx'
import { PenTool, Quote, Star } from 'lucide-react'
import { useState } from 'react'
import { Brand } from '~/components/Brands'
import { GradientBorder } from '~/components/gradient-border'
import { GrowingUnderline } from '~/components/growing-underline'
import Image from '~/components/Image'
import Link from '~/components/Link'
import Twemoji from '~/components/Twemoji'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import type { GoodreadsBook } from '~/types/data'

export function BookCard({ book }: { book: GoodreadsBook }) {
  let url = getBookUrl(book.content)
  let [tab, setTab] = useState<'summary' | 'review'>('summary')

  return (
    <GradientBorder className="flex gap-8 rounded-xl p-6 dark:bg-white/5">
      <TiltedGridBackground className="inset-0" />
      <div className="flex w-60 shrink-0 items-center justify-center">
        <Image
          src={book.book_large_image_url}
          alt={book.title}
          width={1000}
          height={1500}
          className="h-auto w-full rounded-r-2xl object-cover object-center"
          style={{ boxShadow: '9px 10px 5px 0 rgba(92,92,92,.2)' }}
        />
      </div>
      <div className="flex grow flex-col justify-between gap-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-8">
              {book.link ? (
                <Link href={book.link} className="text-2xl font-semibold">
                  <GrowingUnderline>{book.title}</GrowingUnderline>
                </Link>
              ) : (
                <h3 className="text-2xl font-semibold">{book.title}</h3>
              )}
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gray-200 px-3 py-0.5 dark:bg-gray-700">
                <Star size={18} strokeWidth={1.5} />
                <span>{book.user_rating}</span>
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="-ml-1 flex items-center gap-2">
              <button
                onClick={() => setTab('summary')}
                className={clsx(
                  'inline-flex items-center gap-1 font-medium underline-offset-4',
                  tab === 'summary'
                    ? 'underline'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                )}
              >
                <Twemoji emoji="spiral-notepad" />
                <span>Summary</span>
              </button>
              {book.user_review && (
                <>
                  <span>/</span>
                  <button
                    className={clsx(
                      'inline-flex items-center gap-1 font-medium underline-offset-4',
                      tab === 'review'
                        ? 'underline'
                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                    )}
                    onClick={() => setTab('review')}
                  >
                    <Twemoji emoji="glowing-star" />
                    <span>My review</span>
                  </button>
                </>
              )}
            </div>
            <div className="relative pr-4">
              {tab === 'summary' ? (
                <>
                  <Quote
                    size={20}
                    strokeWidth={1.5}
                    className="absolute -top-2 right-0 z-[-1] h-10 w-10 text-gray-200 dark:text-gray-700"
                  />
                  <p
                    className="line-clamp-5 font-medium text-gray-600 dark:text-gray-400"
                    dangerouslySetInnerHTML={{ __html: book.book_description }}
                  />
                </>
              ) : (
                <>
                  <PenTool
                    size={20}
                    strokeWidth={1.5}
                    className="absolute -top-2 right-0 z-[-1] h-10 w-10 text-gray-200 dark:text-gray-700"
                  />
                  <p className="dark:text-gray-450 line-clamp-3 font-medium text-gray-600 dark:text-gray-400">
                    {book.user_review}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Twemoji emoji="writing-hand" /> by{' '}
              <span className="font-semibold">{book.author_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">(avg. {book.average_rating}/5)</span>
            </div>
          </div>
          {url && (
            <Link href={url}>
              <GrowingUnderline>
                <Brand
                  type="Goodreads"
                  as="icon"
                  className="h-5 text-goodreads dark:text-gray-100"
                />
              </GrowingUnderline>
            </Link>
          )}
        </div>
      </div>
    </GradientBorder>
  )
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
