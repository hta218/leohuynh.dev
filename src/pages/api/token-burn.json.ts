import type { APIRoute } from 'astro'
import { jsonHeaders } from '~/lib/runtime/shared'
import { fetchTokenBurn } from '~/lib/runtime/token-burn'

export const prerender = false

export const GET: APIRoute = async () => {
  const payload = await fetchTokenBurn()
  // token-burn data changes ~once/day per machine — cache generously.
  return new Response(JSON.stringify(payload), { headers: jsonHeaders(600) })
}
