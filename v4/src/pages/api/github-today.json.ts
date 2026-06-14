import type { APIRoute } from 'astro'
import { fetchGithubToday, jsonHeaders } from '~/lib/runtime'

export const prerender = true

export const GET: APIRoute = async () => {
  const payload = await fetchGithubToday()
  return new Response(JSON.stringify(payload), { headers: jsonHeaders(120) })
}
