import useSWR from 'swr'
import type { SpotifyNowPlayingData } from '~/types/data'
import { fetcher } from '~/utils/fetch'

export function useNowPlaying() {
  let { data } = useSWR<SpotifyNowPlayingData>('/api/spotify', fetcher)
  return data || { isPlaying: false }
}
