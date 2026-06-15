import { useEffect, useRef, useState } from 'react'
import { emojiGlyph } from '~/lib/emoji'
import { fetchStats, postStats } from '~/lib/stats'
import type { ReactionKey, StatsType } from '~/types/stats'

/**
 * Four-reaction bar (loves / applauses / bullseyes / ideas), ported from legacy
 * `components/blog/reactions.tsx`. Per-visitor reactions are capped at 10 each per slug
 * via localStorage. It renders and works even when `/api/stats` is unavailable: with no
 * endpoint the base counts are 0 and only the visitor's own optimistic clicks show — a
 * write that can't persist is silently dropped rather than faked.
 */
const MAX_REACTIONS = 10

const REACTIONS: Array<{ emoji: string; key: ReactionKey; label: string }> = [
  { emoji: 'sparkling-heart', key: 'loves', label: 'love' },
  { emoji: 'clapping-hands', key: 'applauses', label: 'applause' },
  { emoji: 'bullseye', key: 'bullseyes', label: 'bullseye' },
  { emoji: 'light-bulb', key: 'ideas', label: 'idea' },
]

type Counts = Record<ReactionKey, number>

const EMPTY_COUNTS: Counts = { loves: 0, applauses: 0, ideas: 0, bullseyes: 0 }

function readLocal(storageKey: string): Counts {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || '{}')
    return {
      loves: data.loves || 0,
      applauses: data.applauses || 0,
      ideas: data.ideas || 0,
      bullseyes: data.bullseyes || 0,
    }
  } catch {
    return { ...EMPTY_COUNTS }
  }
}

export default function Reactions({
  type,
  slug,
}: {
  type: StatsType
  slug: string
}) {
  const storageKey = `${type}/${slug}`
  // Stats persisted server-side; `null` until the endpoint answers (stays null if static).
  const [base, setBase] = useState<Counts | null>(null)
  // This visitor's own reactions for the current session (seeded from localStorage).
  const [local, setLocal] = useState<Counts>({ ...EMPTY_COUNTS })
  // localStorage snapshot at load, so previously-saved reactions aren't double-counted.
  const initialRef = useRef<Counts>({ ...EMPTY_COUNTS })
  const saveTimers = useRef<
    Partial<Record<ReactionKey, ReturnType<typeof setTimeout>>>
  >({})

  useEffect(() => {
    const stored = readLocal(storageKey)
    initialRef.current = stored
    setLocal(stored)

    let cancelled = false
    fetchStats(type, slug).then((stats) => {
      if (cancelled || !stats) return
      setBase({
        loves: stats.loves,
        applauses: stats.applauses,
        ideas: stats.ideas,
        bullseyes: stats.bullseyes,
      })
    })
    return () => {
      cancelled = true
    }
  }, [type, slug, storageKey])

  function save(key: ReactionKey, nextLocal: Counts) {
    localStorage.setItem(storageKey, JSON.stringify(nextLocal))
    const baseCount = base?.[key] ?? 0
    const delta = nextLocal[key] - initialRef.current[key]
    // Fire-and-forget; dropped cleanly when the endpoint can't persist.
    postStats({ type, slug, [key]: baseCount + delta })
  }

  function react(key: ReactionKey) {
    setLocal((prev) => {
      if (prev[key] >= MAX_REACTIONS) return prev
      const next = { ...prev, [key]: prev[key] + 1 }
      if (saveTimers.current[key]) clearTimeout(saveTimers.current[key])
      saveTimers.current[key] = setTimeout(() => save(key, next), 800)
      return next
    })
  }

  return (
    <div className="flex items-center gap-6">
      {REACTIONS.map(({ key, emoji, label }) => {
        const baseCount = base?.[key] ?? 0
        const display = baseCount + (local[key] - initialRef.current[key])
        const added = local[key]
        return (
          <button
            key={key}
            type="button"
            onClick={() => react(key)}
            aria-label={`React with ${label}`}
            disabled={added >= MAX_REACTIONS}
            className="flex flex-col items-center justify-center gap-1.5 disabled:cursor-not-allowed"
            data-umami-event="post-reaction"
            data-umami-event-post={storageKey}
            data-umami-event-react={key}
          >
            <span
              role="img"
              aria-hidden="true"
              className="text-2xl leading-none transition-transform hover:scale-110"
            >
              {emojiGlyph(emoji)}
            </span>
            <span className="font-mono text-xs font-semibold text-muted">
              {base === null && added === 0 ? '--' : display}
              {added > 0 && (
                <span className="ml-1 text-code-green">+{added}</span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
