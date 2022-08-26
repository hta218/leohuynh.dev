import type { NextApiRequest, NextApiResponse } from 'next'
import { getNowPlaying } from '~/libs'

export default async function fetchNowPlaying(_: NextApiRequest, res: NextApiResponse) {
  let response = await getNowPlaying()
  if (response.status === 204 || response.status > 400) {
    return res.status(200).json({ isPlaying: false })
  }

  // TODO: types
  let songData = await response.json()
  let isPlaying = songData.is_playing
  let title = songData.item.name
  let artist = songData.item.artists.map((art) => art.name).join(', ')
  let album = songData.item.album.name
  let albumImageUrl = songData.item.album.images[0].url
  let songUrl = songData.item.external_urls.spotify

  return res.status(200).json({
    album,
    albumImageUrl,
    artist,
    isPlaying,
    songUrl,
    title,
  })
}
