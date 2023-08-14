import type { SpotifyNowPlayingData } from '~/types/server'
import { fetcher } from '~/utils/fetcher'
let { default: useSWR } = require('swr')

export function SpotifyNowPlaying() {
  let response = useSWR('/api/spotify', fetcher)
  let { songUrl, title, artist } = (response.data as SpotifyNowPlayingData) || {}

  return (
    <div className="flex items-center bg-gray-900 px-3 py-2 xl:px-6">
      <svg
        className="h-5.5 w-5.5 flex-shrink-0 text-spotify"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
        />
      </svg>
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
