import { useEffect, useState } from 'react'
import type { SpotifyNowPlayingData } from '~/types/data'
import IconSpotify from '~/icons/spotify.svg'

export function SpotifyNowPlaying() {
  let [nowPlayingSong, setNowPlayingSong] = useState<SpotifyNowPlayingData>()

  useEffect(() => {
    function fetchNowPlayingSong() {
      fetch('/api/spotify')
        .then((res) => res.json())
        .then(setNowPlayingSong)
        .catch(console.error)
    }
    fetchNowPlayingSong()
    window.addEventListener('focus', fetchNowPlayingSong)
    return () => window.removeEventListener('focus', fetchNowPlayingSong)
  }, [])

  let { songUrl, title, artist } = nowPlayingSong || {}

  return (
    <div className="flex items-center bg-gray-900 px-3 py-1.5 xl:px-5">
      <IconSpotify className="h-5.5 w-5.5 flex-shrink-0" />
      <div className="ml-2 inline-flex truncate">
        {songUrl ? (
          <>
            <div className="mr-2 flex h-5 items-end pb-0.5 pt-1">
              <div className="h-full w-0.5 animate-music-bar-1 bg-spotify"></div>
              <div className="mx-0.5 h-1/2 w-0.5 animate-music-bar-2 bg-spotify"></div>
              <div className="h-full w-0.5 animate-music-bar-3 bg-spotify"></div>
              <div className="mx-0.5 h-1/2 w-0.5 animate-music-bar-4 bg-spotify"></div>
            </div>
            <a
              className="font-medium text-gray-200"
              href={songUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`${title} - ${artist || 'Spotify'}`}
            >
              {title}
            </a>
          </>
        ) : (
          <p className="font-medium text-gray-200">Not Playing</p>
        )}
        <span className="mx-2 text-gray-300">{' – '}</span>
        <p className="max-w-max truncate text-gray-300">{artist || 'Spotify'}</p>
      </div>
    </div>
  )
}
