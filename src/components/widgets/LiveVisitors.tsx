import { useEffect, useState } from 'react'
import { fetchSiteStats } from '~/lib/stats'

const POLL_INTERVAL_MS = 30_000

/**
 * Home page "live visitors" card: visitors active right now (last ~5 min), from Umami via
 * `/api/site-stats.json`. Polls every ~30s so it stays live. Renders just the plain count (the
 * pulsing "live" dot lives in the card's icon slot), and falls back to `—` when Umami can't answer.
 */
export default function LiveVisitors() {
  const [online, setOnline] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const stats = await fetchSiteStats()
      if (!cancelled) setOnline(stats.ok ? stats.online : null)
    }

    load()
    const id = setInterval(load, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return <>{online === null ? '—' : online.toLocaleString()}</>
}
