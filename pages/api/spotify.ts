import type { NextApiRequest, NextApiResponse } from 'next'
import { getNowPlaying } from '~/libs'
import type { SpotifyNowPlayingData } from '~/types'

export default async function fetchNowPlaying(_: NextApiRequest, res: NextApiResponse) {
  let response = await getNowPlaying()
  if (response.status === 204 || response.status > 400) {
    return res.status(200).json({ isPlaying: false })
  }

  let data = await response.json()
  let songData: SpotifyNowPlayingData = {
    isPlaying: data.is_playing,
    title: data.item.name,
    artist: data.item.artists.map((art: { name: string }) => art.name).join(', '),
    album: data.item.album.name,
    albumImageUrl: data.item.album.images[0]?.url,
    songUrl: data.item.external_urls.spotify,
  }

  return res.status(200).json(songData)
}
