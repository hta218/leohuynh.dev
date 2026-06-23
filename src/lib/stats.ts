/**
 * Client-side compatibility layer for views + reactions.
 *
 * It targets the legacy `/api/stats` contract (GET `?slug=&type=`, POST a partial row).
 * v4 also includes `api/stats.ts` as a Vercel Function for persisted production writes.
 * Plain `astro preview` does not serve Vercel Functions, so every call here still degrades
 * gracefully: a missing/404/erroring endpoint yields `null` (reads) or `false` (writes)
 * instead of throwing. The widgets then render fallback UI and never pretend a write was persisted.
 *
 * In plain `astro preview`, the Vercel Function is absent; with `DATABASE_URL` on Vercel,
 * the same calls persist via `api/stats.ts`.
 */
import type { BlogStats, StatsType } from '~/types/stats'

const STATS_ENDPOINT = '/api/stats'
const HITS_ENDPOINT = '/api/hits.json'

export function emptyStats(type: StatsType, slug: string): BlogStats {
  return {
    type,
    slug,
    views: 0,
    loves: 0,
    applauses: 0,
    ideas: 0,
    bullseyes: 0,
  }
}

function normalize(
  type: StatsType,
  slug: string,
  data: Partial<BlogStats>,
): BlogStats {
  return {
    type,
    slug,
    views: data.views ?? 0,
    loves: data.loves ?? 0,
    applauses: data.applauses ?? 0,
    ideas: data.ideas ?? 0,
    bullseyes: data.bullseyes ?? 0,
  }
}

/** Read stats for a slug. Returns `null` when the endpoint is unavailable (static build). */
export async function fetchStats(
  type: StatsType,
  slug: string,
): Promise<BlogStats | null> {
  try {
    const params = new URLSearchParams({ slug, type })
    const res = await fetch(`${STATS_ENDPOINT}?${params.toString()}`)
    if (!res.ok) return null
    const data = (await res.json()) as Partial<BlogStats>
    return normalize(type, slug, data)
  } catch {
    return null
  }
}

/**
 * Persist a partial stats update. Returns `true` only on a real persisted success;
 * a 404/unavailable endpoint returns `false` so the UI never fakes persistence.
 */
export async function postStats(
  update: Partial<BlogStats> & { type: StatsType; slug: string },
): Promise<boolean> {
  try {
    const res = await fetch(STATS_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(update),
    })
    return res.ok
  } catch {
    return false
  }
}

/** Read the site-wide global hit count. Returns `null` when the endpoint is unavailable. */
export async function fetchSiteHits(): Promise<number | null> {
  try {
    const res = await fetch(HITS_ENDPOINT)
    if (!res.ok) return null
    const data = (await res.json()) as { ok?: boolean; hits?: number }
    if (!data.ok || typeof data.hits !== 'number') return null
    return data.hits
  } catch {
    return null
  }
}

/** Increment the site-wide hit count (fire-and-forget). Errors are swallowed. */
export async function incrementSiteHits(): Promise<void> {
  try {
    await fetch(HITS_ENDPOINT, { method: 'POST', keepalive: true })
  } catch {
    // ignore — vanity counter, never block or surface failures
  }
}
