import { SITE } from '~/lib/site'
import { env, timeoutSignal } from './shared'

export function getUmamiWebsiteId(): string | undefined {
  return env('PUBLIC_UMAMI_WEBSITE_ID')
}

/**
 * Umami public share auth, derived entirely from the public share URL in `SITE.analytics`
 * — no username/password or API key. Flow:
 *   1. `GET {base}/api/share/{shareId}` → `{ websiteId, token }` (a read-only JWT).
 *   2. Pass that token as `x-umami-share-token` on the website data endpoints.
 * The share token carries no `exp`, so we cache it for a few hours and only re-resolve on a
 * 401/403 (rotated share link) — see `umamiWebsiteFetch`.
 */
type UmamiShareAuth = { base: string; websiteId: string; token: string }

const UMAMI_AUTH_TTL_MS = 6 * 60 * 60 * 1000
let umamiAuthCache: { value: UmamiShareAuth; expiresAt: number } | null = null

function parseUmamiShare(): { base: string; shareId: string } | null {
  try {
    const url = new URL(SITE.analytics.umamiShareUrl)
    const parts = url.pathname.split('/').filter(Boolean)
    const shareIdx = parts.indexOf('share')
    const shareId = shareIdx >= 0 ? parts[shareIdx + 1] : undefined
    return shareId ? { base: url.origin, shareId } : null
  } catch {
    return null
  }
}

async function getUmamiShareAuth(): Promise<UmamiShareAuth | null> {
  const now = Date.now()
  if (umamiAuthCache && umamiAuthCache.expiresAt > now)
    return umamiAuthCache.value

  const parsed = parseUmamiShare()
  if (!parsed) return null

  const res = await fetch(`${parsed.base}/api/share/${parsed.shareId}`, {
    signal: timeoutSignal(),
  })
  if (!res.ok) return null

  const data = (await res.json()) as { token?: string; websiteId?: string }
  if (!data.token || !data.websiteId) return null

  const value: UmamiShareAuth = {
    base: parsed.base,
    websiteId: data.websiteId,
    token: data.token,
  }
  umamiAuthCache = { value, expiresAt: now + UMAMI_AUTH_TTL_MS }
  return value
}

/** Fetch a website data endpoint with the share token, re-resolving once on 401/403. */
async function umamiWebsiteFetch(
  path: string,
  retry = true,
): Promise<Response | null> {
  const auth = await getUmamiShareAuth()
  if (!auth) return null

  const res = await fetch(
    `${auth.base}/api/websites/${auth.websiteId}${path}`,
    {
      headers: { 'x-umami-share-token': auth.token },
      signal: timeoutSignal(),
    },
  )

  if ((res.status === 401 || res.status === 403) && retry) {
    umamiAuthCache = null
    return umamiWebsiteFetch(path, false)
  }
  return res
}

/** Umami traffic numbers: all-time pageviews + visitors, plus active visitors right now. */
export type UmamiTraffic = {
  hits: number | null
  online: number | null
  visitors: number | null
}

export async function fetchUmamiTraffic(): Promise<UmamiTraffic> {
  const empty: UmamiTraffic = { hits: null, online: null, visitors: null }
  try {
    const auth = await getUmamiShareAuth()
    if (!auth) return empty

    const [activeRes, statsRes] = await Promise.all([
      umamiWebsiteFetch('/active'),
      umamiWebsiteFetch(`/stats?startAt=0&endAt=${Date.now()}`),
    ])

    let online: number | null = null
    if (activeRes?.ok) {
      // Umami v1 returns `{ x }`, v2 `{ visitors }`.
      const data = (await activeRes.json()) as { x?: number; visitors?: number }
      online =
        typeof data.x === 'number'
          ? data.x
          : typeof data.visitors === 'number'
            ? data.visitors
            : null
    }

    let hits: number | null = null
    let visitors: number | null = null
    if (statsRes?.ok) {
      const data = (await statsRes.json()) as {
        pageviews?: { value?: number }
        visitors?: { value?: number }
      }
      hits =
        typeof data.pageviews?.value === 'number' ? data.pageviews.value : null
      visitors =
        typeof data.visitors?.value === 'number' ? data.visitors.value : null
    }

    return { hits, online, visitors }
  } catch {
    return empty
  }
}
