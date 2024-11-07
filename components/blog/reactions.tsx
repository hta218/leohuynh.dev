'use client'

import { clsx } from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { Twemoji } from '~/components/ui/twemoji'
import type { SelectStats, StatsType } from '~/db/schema'
import { useBlogStats, useUpdateBlogStats } from '~/hooks/use-blog-stats'

const MAX_REACTIONS = 10

const REACTIONS: Array<{ emoji: string; key: keyof SelectStats }> = [
  {
    emoji: 'sparkling-heart',
    key: 'loves',
  },
  {
    emoji: 'clapping-hands',
    key: 'applauses',
  },
  {
    emoji: 'bullseye',
    key: 'bullseyes',
  },
  {
    emoji: 'light-bulb',
    key: 'ideas',
  },
]

export function Reactions({
  type,
  slug,
  className,
}: {
  type: StatsType
  slug: string
  className?: string
}) {
  let [stats, isLoading] = useBlogStats(type, slug)
  let updateReaction = useUpdateBlogStats()
  let [initialReactions, setInitialReactions] = useState({})
  let [reactions, setReactions] = useState({})

  useEffect(() => {
    try {
      let data = JSON.parse(localStorage.getItem(`${type}/${slug}`) || '{}')
      data.loves = data.loves || 0
      data.applauses = data.applauses || 0
      data.ideas = data.ideas || 0
      data.bullseyes = data.bullseyes || 0
      setInitialReactions(Object.assign({}, data))
      setReactions(Object.assign({}, data))
    } catch (e) {}
  }, [])

  function handleChange(key: string) {
    updateReaction({ type, slug, [key]: stats[key] + reactions[key] - initialReactions[key] })
    localStorage.setItem(`${type}/${slug}`, JSON.stringify(reactions))
  }

  return (
    <div className={clsx('flex items-center gap-6', className)}>
      {REACTIONS.map(({ key, emoji }) => (
        <Reaction
          key={key}
          emoji={emoji}
          value={isLoading ? '--' : stats[key] + reactions[key] - initialReactions[key]}
          reactions={reactions[key]}
          onReact={(v) => setReactions((r) => ({ ...r, [key]: v }))}
          onSave={() => handleChange(key)}
        />
      ))}
    </div>
  )
}

function Reaction({
  emoji,
  value,
  reactions,
  onReact,
  onSave,
}: {
  emoji: string
  value: string | number
  reactions: number
  onReact: (v: number) => void
  onSave: () => void
}) {
  let [reacting, setReacting] = useState(false)
  let countRef = useRef<HTMLSpanElement>(null)
  let reactingTimeoutId: ReturnType<typeof setTimeout> | undefined

  function handleReact() {
    if (typeof value === 'number') {
      if (reactingTimeoutId) {
        clearTimeout(reactingTimeoutId)
      }
      setReacting(true)
      let newReactions = reactions >= MAX_REACTIONS ? MAX_REACTIONS : reactions + 1
      onReact(newReactions)
      if (countRef.current) {
        if (reactions >= MAX_REACTIONS) {
          countRef.current.classList.add('animate-scale-up')
          setTimeout(() => {
            if (countRef.current) {
              countRef.current.classList.remove('animate-scale-up')
            }
          }, 150)
        }
      }
    }
  }

  function handleMouseLeave() {
    if (typeof value === 'number') {
      if (reacting) {
        reactingTimeoutId = setTimeout(() => {
          setReacting(false)
          onSave()
        }, 1000)
      }
    }
  }

  return (
    <button
      onClick={handleReact}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center gap-1.5"
      data-umami-event="post-reaction"
    >
      <Twemoji
        emoji={emoji}
        size="2x"
        // className="grayscale transition-[filter] hover:grayscale-0"
      />
      <span className="relative h-6 w-8 overflow-hidden">
        <span
          className={clsx(
            'absolute inset-0',
            'font-semibold text-gray-600 dark:text-gray-300',
            'transition-all',
            reacting ? '-translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
          )}
        >
          {typeof value === 'string' ? '--' : value}
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
          +{reactions}
        </span>
      </span>
    </button>
  )
}
