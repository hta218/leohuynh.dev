'use client'

import { useActivities } from '~/hooks/use-activities'
import { useIntersectionObserver } from '~/hooks/use-intersection-observer'
import { CommitHistory } from './commit-history'
import { CurrentlyReading } from './currently-reading'
import { LastPlayed } from './last-played'
import { LastWatched } from './last-watched'
import { PullRequest } from './pull-request'
import { ActivitiesSkeleton } from './skeleton'

export function ActivitiesFeed() {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0,
    triggerOnce: true,
  })

  const { data, isLoading } = useActivities(isIntersecting)

  if (!isIntersecting || isLoading) {
    return (
      <div ref={targetRef}>
        <ActivitiesSkeleton />
      </div>
    )
  }

  if (!data) {
    return <div ref={targetRef} />
  }

  const {
    currentlyReading,
    lastWatchedMovie,
    recentlyPlayed,
    githubActivities,
  } = data
  const { commit, pullRequest } = githubActivities || {}

  return (
    <div ref={targetRef} className="space-y-4 md:space-y-8 pt-8">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold sm:text-2xl sm:leading-10 md:text-4xl">
          Side quests and activities
        </h3>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700" />
      <div className="pt-2 md:pt-0 space-y-6">
        <LastPlayed recentlyPlayed={recentlyPlayed} />
        {commit && <CommitHistory commit={commit} />}
        {pullRequest && <PullRequest pullRequest={pullRequest} />}
        {currentlyReading && (
          <CurrentlyReading currentlyReading={currentlyReading} />
        )}
        {lastWatchedMovie && (
          <LastWatched lastWatchedMovie={lastWatchedMovie} />
        )}
      </div>
    </div>
  )
}
