import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  Film,
  GitCommitHorizontal,
  GitPullRequestArrow,
  Music,
} from 'lucide-react'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import type { SelectBook, SelectMovie } from '~/db/schema'
import type { GithubUserActivity, RecentlyPlayedData } from '~/types/data'
import { getTimeAgo } from '~/utils/misc'

interface LatestActivitiesProps {
  currentlyReading: SelectBook | null
  lastWatchedMovie: SelectMovie | null
  recentlyPlayed: RecentlyPlayedData
  githubActivities: GithubUserActivity[]
}

interface Activity {
  id: string
  image: string
  action: string
  title: string
  subtitle: string
  timestamp: string
  link: string
  detailsPage: string
  sortDate?: Date
  Icon: React.ReactElement
}

export function Activities({
  currentlyReading,
  lastWatchedMovie,
  recentlyPlayed,
  githubActivities,
}: LatestActivitiesProps) {
  let pullRequest = githubActivities.find(
    (activity) => activity.type === 'pullRequest',
  )
  let commit = githubActivities.find((activity) => activity.type === 'commit')
  const activities = [
    // Spotify activity
    ...(recentlyPlayed.ok
      ? [
          {
            id: 'spotify',
            image: recentlyPlayed.song.albumImageUrl,
            action: 'Last played:',
            title: recentlyPlayed.song.title,
            subtitle: recentlyPlayed.song.artist,
            timestamp: getTimeAgo(recentlyPlayed.song.playedAt),
            link: recentlyPlayed.song.songUrl,
            detailsPage:
              'https://open.spotify.com/user/31uxi2mgkrjhj4agxmudr5cmfj7a',
            sortDate: new Date(recentlyPlayed.song.playedAt),
            Icon: <Music className="h-4 w-4 text-green-600" />,
          },
        ]
      : []),
    // Reading activity
    ...(currentlyReading
      ? [
          {
            id: 'reading',
            image: currentlyReading.bookLargeImageUrl,
            action: 'Currently reading:',
            title: currentlyReading.title,
            subtitle: `by ${currentlyReading.authorName}`,
            timestamp: getTimeAgo(currentlyReading.userDateAdded),
            link: currentlyReading.link,
            detailsPage: '/books',
            sortDate: new Date(currentlyReading.userDateAdded),
            Icon: <BookOpen className="h-4 w-4 text-amber-600" />,
          },
        ]
      : []),
    // GitHub pull request activity
    ...(pullRequest
      ? [
          {
            id: `github-pr-${pullRequest.number}`,
            image: pullRequest.repository.owner.avatarUrl,
            action: 'Opened pull request:',
            title: pullRequest.title,
            subtitle: pullRequest.repository.nameWithOwner,
            timestamp: getTimeAgo(pullRequest.createdAt),
            link: pullRequest.url,
            detailsPage: pullRequest.repository.url,
            sortDate: new Date(pullRequest.createdAt),
            Icon: <GitPullRequestArrow className="h-4 w-4 text-blue-600" />,
          },
        ]
      : []),
    // Language learning activity (placeholder)
    // {
    //   id: 'duolingo',
    //   image: '🇪🇸',
    //   action: 'Practiced',
    //   title: 'Spanish Lesson: Past Tense',
    //   subtitle: '15 XP earned • 7 day streak',
    //   timestamp: '3h ago',
    //   link: '#',
    // },

    // Coding exercise (placeholder)
    // {
    //   id: 'coding',
    //   image: '💻',
    //   action: 'Completed',
    //   title: 'Two Fer Exercise',
    //   subtitle: 'JavaScript Track • Mentored',
    //   timestamp: '6h ago',
    //   link: '#',
    // },

    // Movie activity
    ...(lastWatchedMovie
      ? [
          {
            id: 'movie',
            image: lastWatchedMovie.poster,
            action: 'Last watched:',
            title: lastWatchedMovie.title,
            subtitle: `${lastWatchedMovie.year} • ${lastWatchedMovie.runtime} mins`,
            timestamp: getTimeAgo(lastWatchedMovie.dateRated),
            link: lastWatchedMovie.url,
            detailsPage: '/movies',
            sortDate: new Date(lastWatchedMovie.dateRated),
            Icon: <Film className="h-4 w-4 text-purple-600" />,
          },
        ]
      : []),

    // GitHub commit activity
    ...(commit
      ? [
          {
            id: `github-commit-${commit.abbreviatedOid}`,
            image: commit.repository.owner.avatarUrl,
            action: 'Committed:',
            title: commit.message.split('\n')[0], // Use first line of commit message as subtitle
            subtitle: commit.repository.nameWithOwner,
            timestamp: getTimeAgo(commit.createdAt),
            link: commit.url,
            detailsPage: commit.repository.url,
            sortDate: new Date(commit.createdAt),
            Icon: <GitCommitHorizontal className="h-4 w-4 text-gray-600" />,
          },
        ]
      : []),
  ]

  return (
    <div className="space-y-8 pt-8">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold sm:text-2xl sm:leading-10 md:text-4xl">
          Side quests and activities
        </h3>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700" />
      <div className="space-y-6">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  )
}

function ActivityItem({ activity }: { activity: Activity }) {
  let { action, title, link, image, detailsPage, subtitle, timestamp, Icon } =
    activity
  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        <Image
          alt={title}
          loading="lazy"
          width="400"
          height="400"
          className="h-auto w-20 rounded-lg object-cover"
          src={image}
        />
        <div className="absolute -right-1 -bottom-1 flex items-center justify-center rounded-full bg-white p-1.5 shadow-md">
          {Icon}
        </div>
      </div>
      <div className="flex grow items-center justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="mb-1 font-medium">
              <span className="font-medium text-[#71717a] dark:text-gray-400">
                {action}
              </span>{' '}
              <Link href={link} className="font-semibold">
                <GrowingUnderline>{title}</GrowingUnderline>
              </Link>
            </p>
            <p className="line-clamp-1 text-sm text-[#71717a] italic dark:text-gray-400">
              {subtitle}
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span className="ml-4 flex-shrink-0 rounded-full bg-neutral-200 px-2.5 py-0.5 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            {timestamp}
          </span>
          <Link
            href={detailsPage}
            className="rounded p-2 text-gray-700 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {detailsPage.startsWith('http') ? (
              <ExternalLink className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}
