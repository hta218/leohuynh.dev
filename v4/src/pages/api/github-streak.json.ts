import type { APIRoute } from 'astro'
import { fetchGithubStreak, jsonHeaders } from '~/lib/runtime'

export const prerender = false

export const GET: APIRoute = async () => {
  const payload = await fetchGithubStreak()
  return new Response(JSON.stringify(payload), {
    headers: jsonHeaders(86_400),
  })
}
