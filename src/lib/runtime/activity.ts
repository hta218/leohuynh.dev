import { getCurrentlyReading, getLatestWatched } from '~/lib/media'
import type { ActivityItem, ActivityPayload } from '~/types/integrations'
import { fetchLatestGithubActivity } from './github/latest-activity'

export async function fetchActivity(): Promise<ActivityPayload> {
  const items: ActivityItem[] = []
  // Run sequentially rather than Promise.all: concurrent queries on the shared
  // pgbouncer transaction-pooler connection can deadlock. Each query is only a
  // few ms, so sequential is fine and keeps this endpoint off that failure mode.
  const currentlyReading = await getCurrentlyReading()
  const watched = await getLatestWatched()
  // Prefer an actively-read book over a paused one for the rail.
  const reading =
    currentlyReading.find((book) => !book.userShelves.includes('paused')) ??
    currentlyReading[0]
  const github = await fetchLatestGithubActivity()

  if (reading) {
    items.push({
      type: 'book',
      title: reading.title,
      subtitle: reading.authorName,
      url: reading.link,
      imageUrl: reading.imageUrl,
      meta: 'currently reading',
    })
  }

  if (watched) {
    items.push({
      type: 'movie',
      title: watched.title,
      subtitle: `${watched.year} • ${watched.runtime} mins • ★ ${watched.yourRating}`,
      url: watched.url,
      imageUrl: watched.poster,
      meta: 'last watched',
    })
  }

  if (github) items.push(github)

  if (items.length === 0) {
    items.push({
      type: 'build',
      title: 'scaffolded v4',
      subtitle: 'astro + bun workspace',
      meta: 'build log',
    })
  }

  return { ok: true, items: items.slice(0, 3) }
}
