'use client'

import clsx from 'clsx'
import { PenTool, Quote } from 'lucide-react'
import { useState } from 'react'
import { Twemoji } from '~/components/ui/twemoji'
import type { GoodreadsBook } from '~/types/data'

export function BookDetails({ book }: { book: GoodreadsBook }) {
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
