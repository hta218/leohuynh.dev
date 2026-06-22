import type { APIRoute } from 'astro'
import {
  exchangeGithubCode,
  fetchGithubViewer,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  STATE_COOKIE,
  signGuestbookSession,
  verifyOAuthState,
} from '~/lib/github-oauth'

export const prerender = false

/** GitHub OAuth callback: verify state, exchange code, set session cookie. */
export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get('code')
  const returnedState = url.searchParams.get('state')
  const stateCookie = cookies.get(STATE_COOKIE)?.value

  // Single-use state: clear it regardless of outcome.
  cookies.delete(STATE_COOKIE, { path: '/' })

  if (!verifyOAuthState(stateCookie, returnedState)) {
    return redirect('/guestbook?error=invalid_state', 302)
  }
  if (!code) {
    return redirect('/guestbook?error=missing_code', 302)
  }

  try {
    const accessToken = await exchangeGithubCode(code, url.origin)
    const user = await fetchGithubViewer(accessToken)
    const nowSeconds = Math.floor(Date.now() / 1000)

    cookies.set(SESSION_COOKIE, signGuestbookSession(user, nowSeconds), {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    })

    return redirect('/guestbook', 302)
  } catch (error) {
    console.error('[api/auth/github/callback]', error)
    return redirect('/guestbook?error=oauth_failed', 302)
  }
}
