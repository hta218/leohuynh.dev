'use client'

import clsx from 'clsx'
import { PenTool, Quote, type LucideProps } from 'lucide-react'
import { useState } from 'react'
import { Twemoji } from '~/components/ui/twemoji'
import type { GoodreadsBook } from '~/types/data'

export function BookDetails({ book }: { book: GoodreadsBook }) {
  let [tab, setTab] = useState<'summary' | 'review'>('summary')
  return (
    <div className="space-y-3">
      <div className="-ml-1 flex items-center gap-2">
        <TabTrigger
          active={tab === 'summary'}
          onClick={() => setTab('summary')}
          label="Summary"
          emoji="spiral-notepad"
        />
        {book.user_review && (
          <>
            <span>/</span>
            <TabTrigger
              active={tab === 'review'}
              onClick={() => setTab('review')}
              label="My review"
              emoji="glowing-star"
            />
          </>
        )}
      </div>
      <div className="relative md:pr-4">
        {tab === 'summary' ? (
          <TabContent icon={Quote} content={book.book_description} />
        ) : (
          <TabContent icon={PenTool} content={book.user_review} />
        )}
      </div>
    </div>
  )
}

function TabTrigger(props: { active: boolean; onClick: () => void; label: string; emoji: string }) {
  let { active, onClick, label, emoji } = props
  return (
    <button
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-1 font-medium underline-offset-4',
        active ? 'underline' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
      )}
    >
      <Twemoji emoji={emoji} />
      <span>{label}</span>
    </button>
  )
}

function TabContent(props: { icon: React.FC<LucideProps>; content: string }) {
  let { icon: Icon, content } = props
  return (
    <>
      <Icon
        size={20}
        strokeWidth={1.5}
        className="absolute -top-4 right-0 z-[-1] h-10 w-10 text-gray-200 dark:text-gray-700 md:-top-2"
      />
      <p className="line-clamp-5 italic text-gray-700 dark:text-gray-400">"{content}"</p>
    </>
  )
}
