import useSWR from 'swr'
import type { SelectBook, SelectMovie } from '~/db/schema'
import type { GithubUserActivity, RecentlyPlayedData } from '~/types/data'
import { fetcher } from '~/utils/misc'

interface ActivitiesData {
  currentlyReading: SelectBook | null
  lastWatchedMovie: SelectMovie | null
  recentlyPlayed: RecentlyPlayedData
  githubActivities: GithubUserActivity | null
}

export function useActivities(shouldFetch: boolean) {
  const { data, error, isLoading } = useSWR<ActivitiesData>(
    shouldFetch ? '/api/activities' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  return {
    data,
    error,
    isLoading,
  }
}
