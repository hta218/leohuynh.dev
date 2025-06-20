const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const CURRENTLY_PLAYING = 'https://api.spotify.com/v1/me/player/currently-playing'
const TOP_TRACKS = 'https://api.spotify.com/v1/me/top/tracks'
const RECENTLY_PLAYED = 'https://api.spotify.com/v1/me/player/recently-played'

let {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token = '',
} = process.env

let basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')

async function getAccessToken() {
  let response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    cache: 'no-store',
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  })

  return response.json()
}

export async function getCurrentlyPlaying() {
  let { access_token } = await getAccessToken()
  let url = new URL(CURRENTLY_PLAYING)
  url.searchParams.append('additional_types', 'track,episode')

  return fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-store',
  })
}

export async function getRecentlyPlayed() {
  let { access_token } = await getAccessToken()

  return fetch(RECENTLY_PLAYED, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}

export async function getTopTracks() {
  let { access_token } = await getAccessToken()

  return fetch(TOP_TRACKS, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}
