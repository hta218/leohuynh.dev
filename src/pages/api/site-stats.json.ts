import type { APIRoute } from 'astro'
import { fetchSiteStats, jsonHeaders } from '~/lib/runtime'

/**
 * Site-wide stats for the home page card: all-time pageviews (`hits`) + active visitors
 * (`online`), proxied read-only from Umami via its public share token. Mirrors the other
 * integration endpoints (`prerender = false`, `jsonHeaders`, graceful payload on failure).
 * Short shared cache so the live `online` number stays reasonably fresh without hammering Umami.
 */
export const prerender = false

export const GET: APIRoute = async () => {
  const payload = await fetchSiteStats()
  return new Response(JSON.stringify(payload), { headers: jsonHeaders(30) })
}
