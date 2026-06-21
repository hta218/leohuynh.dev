import type { APIRoute } from 'astro'
import { SESSION_COOKIE, STATE_COOKIE } from '~/lib/github-oauth'

export const prerender = false

function clearSession(cookies: Parameters<APIRoute>[0]['cookies']) {
  cookies.delete(SESSION_COOKIE, { path: '/' })
  cookies.delete(STATE_COOKIE, { path: '/' })
}

/** Clear guestbook cookies and return to the guestbook. */
export const GET: APIRoute = ({ cookies, redirect }) => {
  clearSession(cookies)
  return redirect('/guestbook', 302)
}

export const POST: APIRoute = ({ cookies, redirect }) => {
  clearSession(cookies)
  return redirect('/guestbook', 302)
}
