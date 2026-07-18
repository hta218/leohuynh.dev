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

async function getSpotifyAccessToken(): Promise<string | null> {
  const clientId = env('SPOTIFY_CLIENT_ID')
  const clientSecret = env('SPOTIFY_CLIENT_SECRET')
  const refreshToken = env('SPOTIFY_REFRESH_TOKEN')

  if (!clientId || !clientSecret || !refreshToken) return null

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

  if (!response.ok) return null

  const data = (await response.json()) as { access_token?: string }
  return data.access_token ?? null
}

export async function fetchSpotifyStatus(): Promise<SpotifyPayload> {
  try {
    const accessToken = await getSpotifyAccessToken()
    if (!accessToken) return unavailableSpotify()

    const currentUrl = new URL(CURRENTLY_PLAYING_ENDPOINT)
    currentUrl.searchParams.set('additional_types', 'track,episode')

    const current = await fetch(currentUrl, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${accessToken}` },
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
      headers: { Authorization: `Bearer ${accessToken}` },
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
