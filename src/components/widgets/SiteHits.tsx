import { useEffect, useState } from 'react'
import { fetchSiteStats } from '~/lib/stats'

/**
 * Home page "hits" card: all-time pageviews from Umami (via `/api/site-stats.json`). Read-only,
 * fetched once on mount. Falls back to `—` when Umami can't answer and never fakes a number.
 */
export default function SiteHits() {
  const [hits, setHits] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchSiteStats().then((stats) => {
      if (cancelled || !stats.ok) return
      setHits(stats.hits)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return <>{hits === null ? '—' : hits.toLocaleString()}</>
}
