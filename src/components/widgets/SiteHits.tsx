import { useEffect, useState } from 'react'
import { fetchSiteHits } from '~/lib/stats'

/**
 * Displays the site-wide global hit count for the home page "views" card. Read-only — the
 * actual increment happens once per page load in `BaseLayout.astro`. Like `ViewsCounter`, it
 * shows a neutral `—` fallback when the `/api/hits.json` endpoint can't answer (static build,
 * missing `DATABASE_URL`) and never fakes a number.
 */
export default function SiteHits() {
  const [hits, setHits] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchSiteHits().then((value) => {
      if (cancelled || value === null) return
      setHits(value)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return <>{hits === null ? '—' : hits.toLocaleString()}</>
}
