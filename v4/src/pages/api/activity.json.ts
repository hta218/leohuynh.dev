import type { APIRoute } from 'astro'
import { fetchActivity, jsonHeaders } from '~/lib/runtime'

export const prerender = true

export const GET: APIRoute = async () => {
  const payload = await fetchActivity()
  return new Response(JSON.stringify(payload), { headers: jsonHeaders(120) })
}
