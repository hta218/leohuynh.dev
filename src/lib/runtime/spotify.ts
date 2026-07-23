import type { SpotifyPayload, SpotifyTrack } from '~/types/integrations'
import { env, timeoutSignal } from './shared'

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const CURRENTLY_PLAYING_ENDPOINT =
  'https://api.spotify.com/v1/me/player/currently-playing'
const RECENTLY_PLAYED_ENDPOINT =
  'https://api.spotify.com/v1/me/player/recently-played?limit=1'

interface SpotifyApiImage {
  url?: string
}

interface SpotifyApiItem {
  type?: 'track' | 'episode' | string
  name?: string
  images?: SpotifyApiImage[]
  external_urls?: { spotify?: string }
  artists?: Array<{ name: string }>
  album?: { name?: string; images?: SpotifyApiImage[] }
  show?: { name?: string; images?: SpotifyApiImage[] }
}

interface SpotifyAccessTokenResult {
  accessToken?: string
  error?: string
}

function unavailableSpotify(
  error = 'Spotify credentials are not configured.',
): SpotifyPayload {
  return { ok: false, status: 'unavailable', isPlaying: false, error }
}

function normalizeTrack(
  item: SpotifyApiItem | null | undefined,
  playedAt?: string,
): SpotifyTrack | undefined {
  if (!item) return undefined

  if (item.type === 'episode') {
    return {
      title: item.name ?? 'Unknown episode',
      artist: item.show?.name ?? 'Unknown show',
      album: item.show?.name ?? 'Podcast',
      albumImageUrl: item.images?.[0]?.url ?? item.show?.images?.[0]?.url,
      songUrl: item.external_urls?.spotify,
      playedAt,
    }
  }

  if (item.type === 'track') {
    return {
      title: item.name ?? 'Unknown track',
      artist: Array.isArray(item.artists)
        ? item.artists.map((artist: { name: string }) => artist.name).join(', ')
        : 'Unknown artist',
      album: item.album?.name ?? 'Unknown album',
      albumImageUrl: item.album?.images?.[0]?.url,
      songUrl: item.external_urls?.spotify,
      playedAt,
    }
  }

  return undefined
}

export async function spotifyTokenFailureMessage(
  response: Response,
): Promise<string> {
  if (response.status === 400) {
    const data = await response
      .clone()
      .json()
      .catch(() => null)

    if (data?.error === 'invalid_grant') {
      return 'Spotify authorization needs to be renewed.'
    }
  }

  return 'Spotify token refresh failed.'
}

async function getSpotifyAccessToken(): Promise<SpotifyAccessTokenResult> {
  const clientId = env('SPOTIFY_CLIENT_ID')
  const clientSecret = env('SPOTIFY_CLIENT_SECRET')
  const refreshToken = env('SPOTIFY_REFRESH_TOKEN')

  if (!clientId || !clientSecret || !refreshToken) {
    return { error: 'Spotify credentials are not configured.' }
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    signal: timeoutSignal(),
  })

  if (!response.ok) {
    return { error: await spotifyTokenFailureMessage(response) }
  }

  const data = (await response.json()) as { access_token?: string }
  if (!data.access_token) return { error: 'Spotify token refresh failed.' }

  return { accessToken: data.access_token }
}

export async function fetchSpotifyStatus(): Promise<SpotifyPayload> {
  try {
    const token = await getSpotifyAccessToken()
    if (!token.accessToken) return unavailableSpotify(token.error)

    const currentUrl = new URL(CURRENTLY_PLAYING_ENDPOINT)
    currentUrl.searchParams.set('additional_types', 'track,episode')

    const current = await fetch(currentUrl, {
      cache: 'no-store',
      headers: { Authorization: ['Bearer', token.accessToken].join(' ') },
      signal: timeoutSignal(),
    })

    if (current.ok && current.status !== 204) {
      const data = await current.json()
      const song = normalizeTrack(data.item)
      if (song && data.is_playing === true) {
        return {
          ok: true,
          status: 'playing',
          isPlaying: true,
          song,
        }
      }
    }

    const recent = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      cache: 'no-store',
      headers: { Authorization: ['Bearer', token.accessToken].join(' ') },
      signal: timeoutSignal(),
    })

    if (recent.ok) {
      const data = await recent.json()
      const last = data.items?.[0]
      const song = normalizeTrack(last?.track, last?.played_at)
      if (song) {
        return { ok: true, status: 'recently-played', isPlaying: false, song }
      }
    }

    return unavailableSpotify('No current or recent Spotify track found.')
  } catch (error) {
    return unavailableSpotify(
      error instanceof Error ? error.message : 'Spotify request failed.',
    )
  }
}
