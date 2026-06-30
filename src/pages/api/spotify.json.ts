import type { APIRoute } from 'astro'
import { jsonHeaders } from '~/lib/runtime/shared'
import { fetchSpotifyStatus } from '~/lib/runtime/spotify'

export const prerender = false

export const GET: APIRoute = async () => {
  const payload = await fetchSpotifyStatus()
  return new Response(JSON.stringify(payload), { headers: jsonHeaders(30) })
}
