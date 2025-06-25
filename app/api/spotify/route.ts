import { getNowPlaying } from './spotify'

export async function GET() {
  let result = await getNowPlaying()

  if (!result.ok) {
    return Response.json({ isPlaying: false, error: result.error })
  }

  return Response.json({
    isPlaying: true,
    song: {
      title: result.song.title,
      artist: result.song.artist,
      album: result.song.album,
      albumImageUrl: result.song.albumImageUrl,
      songUrl: result.song.songUrl,
    },
  })
}
