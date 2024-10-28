'use client'

import { clsx } from 'clsx'
import { useRef, useState } from 'react'
import { Twemoji } from '~/components/ui/twemoji'

const MAX_REACTIONS = 10

const REACTIONS = [
  {
    emoji: 'sparkling-heart',
    count: Math.floor(Math.random() * 30),
  },
  {
    emoji: 'clapping-hands',
    count: Math.floor(Math.random() * 30),
  },
  {
    emoji: 'bullseye',
    count: Math.floor(Math.random() * 30),
  },
  {
    emoji: 'light-bulb',
    count: Math.floor(Math.random() * 30),
  },
]

export function Reactions({ className }: { className?: string }) {
  return (
    <div className={clsx('flex items-center gap-6', className)}>
      {REACTIONS.map(({ emoji, count }) => (
        <Reaction key={emoji} emoji={emoji} count={count} />
      ))}
    </div>
  )
}

function Reaction({ emoji, count }: { emoji: string; count: number }) {
  let [reactionCount, setReactionCount] = useState(0)
  let [reacting, setReacting] = useState(false)
  let countRef = useRef<HTMLSpanElement>(null)
  let reactingTimeoutId: ReturnType<typeof setTimeout> | undefined

  function handleReact() {
    if (reactingTimeoutId) {
      clearTimeout(reactingTimeoutId)
    }
    setReacting(true)
    setReactionCount((c) => (c >= MAX_REACTIONS ? MAX_REACTIONS : c + 1))
    if (countRef.current) {
      if (reactionCount >= MAX_REACTIONS) {
        countRef.current.classList.add('animate-scale-up')
        setTimeout(() => {
          countRef.current!.classList.remove('animate-scale-up')
        }, 150)
      }
    }
  }

  function handleMouseLeave() {
    if (reacting) {
      reactingTimeoutId = setTimeout(() => {
        setReacting(false)
      }, 1000)
    }
  }

  return (
    <button
      onClick={handleReact}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center gap-1.5"
    >
      <Twemoji emoji={emoji} size="2x" />
      <span className="relative h-6 w-8 overflow-hidden">
        <span
          className={clsx(
            'absolute inset-0',
            'font-semibold text-gray-600 dark:text-gray-300',
            'transition-all',
            reacting ? '-translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
          )}
        >
          {count + reactionCount}
        </span>
        <span
          ref={countRef}
          className={clsx(
            'absolute inset-0',
            'text-gray-500 dark:text-gray-400',
            'transition-all',
            reacting ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          )}
        >
          +{reactionCount}
        </span>
      </span>
    </button>
  )
}
