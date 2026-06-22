import type { APIRoute } from 'astro'
import {
  createGithubAuthUrl,
  OAUTH_STATE_MAX_AGE,
  STATE_COOKIE,
  signOAuthState,
} from '~/lib/github-oauth'

export const prerender = false

/** Kick off GitHub OAuth: set a signed `state` cookie, then redirect. */
export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  try {
    const { url: authorizeUrl, state } = createGithubAuthUrl(url.origin)
    cookies.set(STATE_COOKIE, signOAuthState(state), {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      path: '/',
      maxAge: OAUTH_STATE_MAX_AGE,
    })
    return redirect(authorizeUrl, 302)
  } catch (error) {
    console.error('[api/auth/github]', error)
    return redirect('/guestbook?error=oauth_unavailable', 302)
  }
}
