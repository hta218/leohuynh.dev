'use client'

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
  return (
    <GradientBorder className="flex flex-col gap-8 rounded-2xl px-3 py-6 dark:bg-white/5 md:flex-row md:px-6">
      <TiltedGridBackground className="inset-0 z-[-1]" />
      <div className="mx-auto flex w-60 shrink-0 items-center justify-center">
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
            <div className="flex items-start justify-between gap-12 text-xl font-semibold md:text-2xl">
              {book.link ? (
                <Link href={book.link}>
                  <GrowingUnderline>{book.title}</GrowingUnderline>
                </Link>
              ) : (
                <h3>{book.title}</h3>
              )}
              <UserRating rating={book.user_rating} className="hidden md:inline-flex" />
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

function BookMeta({ book }: { book: GoodreadsBook }) {
  return (
    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-1">
        <Twemoji emoji="writing-hand" /> by{' '}
        <span className="font-semibold">{book.author_name}</span>
      </div>
      <div className="hidden items-center gap-1 md:flex">
        <span>(avg. {book.average_rating}/5)</span>
      </div>
    </div>
  )
}

function BookDetails({ book }: { book: GoodreadsBook }) {
  let [tab, setTab] = useState<'summary' | 'review'>('summary')
  return (
    <div className="space-y-3">
      <div className="-ml-1 flex items-center gap-2">
        <button
          onClick={() => setTab('summary')}
          className={clsx(
            'inline-flex items-center gap-1 font-medium underline-offset-4',
            tab === 'summary'
              ? 'underline'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
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
              <span className="md:hidden">({book.user_rating}/5)</span>
            </button>
          </>
        )}
      </div>
      <div className="relative md:pr-4">
        {tab === 'summary' ? (
          <>
            <Quote
              size={20}
              strokeWidth={1.5}
              className="absolute -top-4 right-0 z-[-1] h-10 w-10 text-gray-200 dark:text-gray-700 md:-top-2"
            />
            <p className="line-clamp-5 font-medium italic text-gray-600 dark:text-gray-400">
              "{book.book_description}"
            </p>
          </>
        ) : (
          <>
            <PenTool
              size={20}
              strokeWidth={1.5}
              className="absolute -top-4 right-0 z-[-1] h-10 w-10 text-gray-200 dark:text-gray-700 md:-top-2"
            />
            <p className="font-medium text-gray-600 dark:text-gray-400">{book.user_review}</p>
          </>
        )}
      </div>
    </div>
  )
}

function GoodreadsLink({ url, className }: { url?: string | null; className?: string }) {
  if (url) {
    return (
      <Link href={url} className={className}>
        <Brand type="Goodreads" as="icon" className="h-5 text-goodreads dark:text-gray-100" />
      </Link>
    )
  }
  return null
}

function UserRating({ rating, className }: { rating: number; className?: string }) {
  return (
    <span
      className={clsx([
        'text-base',
        'shrink-0 items-center gap-1',
        'rounded-full px-3 py-0.5',
        'font-medium text-gray-700 dark:text-gray-900',
        'bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-200 via-emerald-200 to-yellow-200',
        'dark:bg-gradient-to-l dark:from-emerald-500 dark:to-lime-600',
        className,
      ])}
    >
      <Star size={18} strokeWidth={1.5} />
      <span>{rating}</span>
    </span>
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
