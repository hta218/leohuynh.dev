import fetch from 'isomorphic-unfetch'
import { SPOTIFY_TOKEN_API, SPOTIFY_NOW_PLAYING_API, SPOTIFY_TOP_TRACKS_API } from '~/constant'

let {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env

let basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')

async function getAccessToken() {
  let response = await fetch(SPOTIFY_TOKEN_API, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  })

  return response.json()
}

export async function getNowPlaying() {
  let { access_token } = await getAccessToken()
  let url = new URL(SPOTIFY_NOW_PLAYING_API)
  url.searchParams.append('additional_types', 'track,episode')

  return fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}

export async function getTopTracks() {
  let { access_token } = await getAccessToken()

  return fetch(SPOTIFY_TOP_TRACKS_API, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}
