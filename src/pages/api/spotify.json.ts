import type { APIRoute } from 'astro'
import { fetchSpotifyStatus, jsonHeaders } from '~/lib/runtime'

export const prerender = false

export const GET: APIRoute = async () => {
  const payload = await fetchSpotifyStatus()
  return new Response(JSON.stringify(payload), { headers: jsonHeaders(30) })
}
