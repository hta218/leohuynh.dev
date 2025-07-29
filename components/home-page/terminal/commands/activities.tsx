import useSWR from 'swr'
import type { ActivitiesFeedData } from '~/app/api/activities/route'
import { Link } from '~/components/ui/link'
import { TerminalLoading } from '~/components/ui/terminal-loading'
import { Twemoji } from '~/components/ui/twemoji'
import { SITE_METADATA } from '~/data/site-metadata'
import { useNowPlaying } from '~/hooks/use-now-playing'
import type { RecentlyPlayedData } from '~/types/data'
import { fetcher, getTimeAgo } from '~/utils/misc'
import type { CommandResult } from '../types'
import { NowPlaying } from './music'

export function LastPlayed({
  recentlyPlayed,
}: {
  recentlyPlayed: RecentlyPlayedData
}) {
  let { data: nowPlayingData } = useNowPlaying()

  // If there's a song currently playing, show that instead
  if (nowPlayingData.isPlaying && nowPlayingData.song) {
    return <NowPlaying song={nowPlayingData.song} />
  }

  // Fall back to recently played if no song is currently playing
  if (!recentlyPlayed.ok) return null

  return (
    <div className="flex items-start gap-2">
      <span>
        <Twemoji emoji="musical-note" size="base" />
      </span>
      <span>
        last played:{' '}
        <Link
          href={recentlyPlayed.song.songUrl}
          target="_blank"
          className="hover:underline underline-offset-4"
        >
          <strong>{recentlyPlayed.song.title}</strong>
        </Link>{' '}
        by <span data-terminal-info>{recentlyPlayed.song.artist}</span>{' '}
        <span data-terminal-info>
          ({getTimeAgo(recentlyPlayed.song.playedAt)})
        </span>
      </span>
    </div>
  )
}

function ActivitiesFeed() {
  let { data, error, isLoading } = useSWR<ActivitiesFeedData>(
    '/api/activities',
    fetcher,
  )

  if (isLoading) {
    return (
      <div className="space-y-2">
        <TerminalLoading text="fetching recent activities..." />
      </div>
    )
  }

  if (error) {
    return <div data-terminal-error>failed to load recent activities</div>
  }

  if (!data) return <div>no recent activities found</div>

  let { currentlyReading, lastWatchedMovie, recentlyPlayed, githubActivities } =
    data

  return (
    <div className="space-y-1">
      <LastPlayed recentlyPlayed={recentlyPlayed} />
      {currentlyReading && (
        <div className="flex items-start gap-2">
          <span>
            <Twemoji emoji="books" size="base" />
          </span>
          <span>
            currently reading:{' '}
            <Link
              href={currentlyReading.link}
              target="_blank"
              className="hover:underline underline-offset-4"
            >
              <strong>{currentlyReading.title}</strong>
            </Link>{' '}
            by <span data-terminal-info>{currentlyReading.authorName}</span>
          </span>
        </div>
      )}

      {lastWatchedMovie && (
        <div className="flex items-start gap-2">
          <span>
            <Twemoji emoji="clapper-board" size="base" />
          </span>
          <span>
            last watched:{' '}
            <Link
              href={lastWatchedMovie.url}
              target="_blank"
              className="hover:underline underline-offset-4"
            >
              <strong>{lastWatchedMovie.title}</strong>
            </Link>{' '}
            <span data-terminal-info>
              {lastWatchedMovie.year} • {lastWatchedMovie.runtime} mins
            </span>{' '}
            ({getTimeAgo(lastWatchedMovie.dateRated)})
          </span>
        </div>
      )}

      {githubActivities?.commit && (
        <div className="flex items-start gap-2">
          <span>
            <Twemoji emoji="keyboard" size="base" />
          </span>
          <span>
            last commit:{' '}
            <Link
              href={githubActivities.commit.url}
              target="_blank"
              className="hover:underline underline-offset-4"
            >
              <strong>{githubActivities.commit.message}</strong>
            </Link>{' '}
            ({getTimeAgo(githubActivities.commit.createdAt)})
          </span>
        </div>
      )}

      {githubActivities?.pullRequest && (
        <div className="flex items-start gap-2">
          <span>
            <Twemoji emoji="shark" size="base" />
          </span>
          <span>
            latest pull request:{' '}
            <Link
              href={githubActivities.pullRequest.url}
              target="_blank"
              className="hover:underline underline-offset-4"
            >
              <strong>{githubActivities.pullRequest.title}</strong>
            </Link>{' '}
            on{' '}
            <Link
              href={githubActivities.pullRequest.repository.url}
              target="_blank"
              className="hover:underline underline-offset-4"
            >
              <strong>
                {githubActivities.pullRequest.repository.owner.login}/
                {githubActivities.pullRequest.repository.name}
              </strong>
            </Link>{' '}
            ({getTimeAgo(githubActivities.pullRequest.createdAt)} •{' '}
            {githubActivities.pullRequest.state.toLowerCase()})
          </span>
        </div>
      )}
      <div>=================</div>
      <div data-terminal-info>
        data fetched from my personal profiles on{' '}
        <Link
          href={SITE_METADATA.spotify}
          target="_blank"
          className="underline underline-offset-4"
        >
          spotify
        </Link>
        ,{' '}
        <Link
          href={SITE_METADATA.goodreadsBookshelfUrl}
          target="_blank"
          className="underline underline-offset-4"
        >
          goodreads
        </Link>
        ,{' '}
        <Link
          target="_blank"
          className="underline underline-offset-4"
          href={SITE_METADATA.imdbRatingsList}
        >
          imdb
        </Link>
        , and{' '}
        <Link
          target="_blank"
          className="underline underline-offset-4"
          href={SITE_METADATA.github}
        >
          github
        </Link>{' '}
      </div>
    </div>
  )
}

export let execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      { type: 'output', content: 'recent activities' },
      { type: 'output', content: '=================' },
      {
        type: 'component',
        component: () => <ActivitiesFeed />,
      },
    ],
  }
}
