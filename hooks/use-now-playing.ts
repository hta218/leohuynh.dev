import useSWR from 'swr'
import type { SpotifyNowPlayingData } from '~/types/data'
import { fetcher } from '~/utils/misc'

export function useNowPlaying() {
  let { isLoading, data } = useSWR<SpotifyNowPlayingData>(
    '/api/spotify',
    fetcher,
  )
  return { isLoading, data: data || { isPlaying: false } }
}
