import type { NowPlayingData, RecentlyPlayedData } from '~/types/data'

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const CURRENTLY_PLAYING =
  'https://api.spotify.com/v1/me/player/currently-playing'
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

export async function getNowPlaying(): Promise<NowPlayingData> {
  try {
    let { access_token } = await getAccessToken()
    let url = new URL(CURRENTLY_PLAYING)
    url.searchParams.append('additional_types', 'track,episode')

    let response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-store',
    })

    if (response.status === 204 || response.status >= 400) {
      return { ok: false, error: 'Bad request or No content available.' }
    }

    let data = await response.json()

    // Handle podcast episodes
    if (data?.currently_playing_type === 'episode') {
      return {
        ok: true,
        song: {
          title: data.item.name,
          artist: data.item.show?.name || 'Unknown Show',
          album: data.item.show?.name || 'Podcast',
          albumImageUrl:
            data.item.images?.[0]?.url || data.item.show?.images?.[0]?.url,
          songUrl: data.item.external_urls?.spotify || '',
        },
      }
    }

    // Handle tracks
    if (data?.item && data.item.type === 'track') {
      return {
        ok: true,
        song: {
          title: data.item.name,
          artist: data.item.artists
            .map((art: { name: string }) => art.name)
            .join(', '),
          album: data.item.album.name,
          albumImageUrl: data.item.album.images[0]?.url,
          songUrl: data.item.external_urls.spotify,
        },
      }
    }

    return { ok: false, error: 'No currently playing track found.' }
  } catch (error) {
    console.error('Error fetching currently playing track:', error)
    return {
      ok: false,
      error: error?.message || error?.toString() || 'Unknown error',
    }
  }
}

export async function getRecentlyPlayed(): Promise<RecentlyPlayedData> {
  try {
    let { access_token } = await getAccessToken()
    let res = await fetch(RECENTLY_PLAYED, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    if (res.status === 204 || res.status >= 400) {
      return { ok: false, error: 'Bad request or No content available.' }
    }

    let data = await res.json()
    if (Array.isArray(data.items) && data.items.length > 0) {
      let lastPlayed = data.items[0]
      return {
        ok: true,
        song: {
          playedAt: lastPlayed.played_at,
          title: lastPlayed.track.name,
          artist: lastPlayed.track.artists
            .map((art: { name: string }) => art.name)
            .join(', '),
          album: lastPlayed.track.album.name,
          albumImageUrl: lastPlayed.track.album.images[0]?.url,
          songUrl: lastPlayed.track.external_urls.spotify,
        },
      }
    }
    return { ok: false, error: 'No recently played tracks found.' }
  } catch (error) {
    console.error('Error fetching recently played tracks:', error)
    return {
      ok: false,
      error: error?.message || error?.toString() || 'Unknown error',
    }
  }
}
