import { useEffect, useState } from 'react'
import type { SpotifyNowPlayingData } from '~/types/data'

export function useNowPlaying() {
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

  return nowPlayingSong || { isPlaying: false }
}
