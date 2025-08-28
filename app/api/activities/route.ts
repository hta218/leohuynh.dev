import { NextResponse } from 'next/server'
import { getRecentlyPlayed } from '~/app/api/spotify/spotify'
import { SITE_METADATA } from '~/data/site-metadata'
import { getCurrentlyReading, getLastWatchedMovie } from '~/db/queries'
import { fetchGithubUserActivities } from '~/utils/github'

const GITHUB_USER = SITE_METADATA.github.split('/').pop()

export async function GET() {
  try {
    const promises = await Promise.allSettled([
      getCurrentlyReading(),
      getLastWatchedMovie(),
      getRecentlyPlayed(),
      fetchGithubUserActivities({ username: GITHUB_USER }),
    ])

    const [
      currentlyReadingBook,
      lastWatchedMovie,
      recentlyPlayed,
      githubActivities,
    ] = promises

    return NextResponse.json({
      currentlyReading:
        currentlyReadingBook.status === 'fulfilled'
          ? currentlyReadingBook.value
          : null,
      lastWatchedMovie:
        lastWatchedMovie.status === 'fulfilled' ? lastWatchedMovie.value : null,
      recentlyPlayed:
        recentlyPlayed.status === 'fulfilled'
          ? recentlyPlayed.value
          : { ok: false, error: 'Failed to fetch recently played data.' },
      githubActivities:
        githubActivities.status === 'fulfilled' ? githubActivities.value : null,
    })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 },
    )
  }
}
