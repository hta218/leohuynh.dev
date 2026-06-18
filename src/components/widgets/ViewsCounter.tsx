import { useEffect, useState } from 'react'
import { fetchStats, postStats } from '~/lib/stats'
import type { StatsType } from '~/types/stats'

/**
 * Renders the view count for an article/snippet and increments it once per page load —
 * but only when the `/api/stats` endpoint actually answers. On a static build (no
 * runtime endpoint) it shows a neutral `–– views` fallback and never fakes a persisted
 * count. Ported from legacy `components/blog/views-counter.tsx`.
 */
export default function ViewsCounter({
  type,
  slug,
}: {
  type: StatsType
  slug: string
}) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchStats(type, slug).then((stats) => {
      if (cancelled || !stats) return
      setViews(stats.views)
      // Fire-and-forget increment; ignored cleanly if the endpoint can't persist.
      postStats({ type, slug, views: stats.views + 1 })
    })
    return () => {
      cancelled = true
    }
  }, [type, slug])

  return (
    <span className="font-mono text-xs text-muted">
      {views === null ? '––' : views.toLocaleString()} views
    </span>
  )
}
