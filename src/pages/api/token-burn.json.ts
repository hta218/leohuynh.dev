import type { APIRoute } from 'astro'
import { fetchTokenBurn, jsonHeaders } from '~/lib/runtime'

export const prerender = false

export const GET: APIRoute = async () => {
  const payload = await fetchTokenBurn()
  // token-burn data changes ~once/day per machine — cache generously.
  return new Response(JSON.stringify(payload), { headers: jsonHeaders(600) })
}
