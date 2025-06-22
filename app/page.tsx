import { allBlogs, allSnippets } from 'contentlayer/generated'
import { Home } from '~/components/home-page'
import { SITE_METADATA } from '~/data/site-metadata'
import { getCurrentlyReading, getLastWatchedMovie } from '~/db/queries'
import { allCoreContent } from '~/utils/contentlayer'
import { getGithubUserActivities } from '~/utils/github'
import { sortPosts } from '~/utils/misc'
import { getRecentlyPlayed } from './api/spotify/spotify'

const MAX_POSTS_DISPLAY = 3
const MAX_SNIPPETS_DISPLAY = 4

export default async function HomePage() {
  let promises = await Promise.allSettled([
    getCurrentlyReading(),
    getLastWatchedMovie(),
    getRecentlyPlayed(),
    getGithubUserActivities({ username: 'hta218' }),
  ])
  let [currentlyReadingBook, lastWatchedMovie, recentlyPlayed, githubActivities] = promises

  return (
    <Home
      posts={allCoreContent(sortPosts(allBlogs)).slice(0, MAX_POSTS_DISPLAY)}
      snippets={allCoreContent(sortPosts(allSnippets)).slice(0, MAX_SNIPPETS_DISPLAY)}
      currentlyReading={
        currentlyReadingBook.status === 'fulfilled' ? currentlyReadingBook.value : null
      }
      lastWatchedMovie={lastWatchedMovie.status === 'fulfilled' ? lastWatchedMovie.value : null}
      recentlyPlayed={
        recentlyPlayed.status === 'fulfilled'
          ? recentlyPlayed.value
          : { ok: false, error: 'Failed to fetch recently played data.' }
      }
      githubActivities={githubActivities.status === 'fulfilled' ? githubActivities.value : []}
    />
  )
}
