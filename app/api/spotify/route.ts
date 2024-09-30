import { getNowPlaying } from './spotify'
import type { SpotifyNowPlayingData } from '~/types/data'

export async function GET() {
  let response = await getNowPlaying()
  if (response.status === 204 || response.status > 400) {
    return Response.json({ isPlaying: false })
  }

  let data = await response.json()
  if (data?.currently_playing_type === 'episode') {
    return Response.json({
      isPlaying: true,
      title: data.item.name,
      songUrl: data.item.external_urls.spotify,
    })
  }
  let songData: SpotifyNowPlayingData = {
    isPlaying: data.is_playing,
    title: data.item.name,
    artist: data.item.artists.map((art: { name: string }) => art.name).join(', '),
    album: data.item.album.name,
    albumImageUrl: data.item.album.images[0]?.url,
    songUrl: data.item.external_urls.spotify,
  }

  return Response.json(songData)
}
