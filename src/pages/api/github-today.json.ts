import type { APIRoute } from 'astro'
import { fetchGithubToday } from '~/lib/runtime/github/day'
import { jsonHeaders } from '~/lib/runtime/shared'

export const prerender = false

export const GET: APIRoute = async () => {
  const payload = await fetchGithubToday()
  return new Response(JSON.stringify(payload), { headers: jsonHeaders(120) })
}
