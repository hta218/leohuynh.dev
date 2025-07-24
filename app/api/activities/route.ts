import { getRecentlyPlayed } from '~/app/api/spotify/spotify'
import { getCurrentlyReading, getLastWatchedMovie } from '~/db/queries'
import type { SelectBook, SelectMovie } from '~/db/schema'
import type { GithubUserActivity, RecentlyPlayedData } from '~/types/data'
import { fetchGithubUserActivities } from '~/utils/github'

export interface ActivitiesFeedData {
  currentlyReading: SelectBook | null
  lastWatchedMovie: SelectMovie | null
  recentlyPlayed: RecentlyPlayedData
  githubActivities: GithubUserActivity | null
}

export async function GET() {
  try {
    let [currentlyReading, lastWatchedMovie, recentlyPlayed, githubActivities] =
      await Promise.all([
        getCurrentlyReading(),
        getLastWatchedMovie(),
        getRecentlyPlayed(),
        fetchGithubUserActivities({ username: 'hta218' }),
      ])

    return Response.json({
      currentlyReading,
      lastWatchedMovie,
      recentlyPlayed,
      githubActivities,
    })
  } catch (error) {
    console.error('Error fetching activities feed:', error)
    return Response.json(
      { error: 'Failed to fetch activities feed' },
      { status: 500 },
    )
  }
}
