import { Suspense } from 'react'
import { genPageMetadata } from '~/app/seo'
import { Container } from '~/components/ui/container'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import { PageHeader } from '~/components/ui/page-header'
import { SITE_METADATA } from '~/data/site-metadata'
import movies from '~/json/movies.json' assert { type: 'json' }
import { MoviesList } from './movies-list'
import type { ImdbMovie } from '~/types/data'

export let metadata = genPageMetadata({ title: 'My movies list' })

export default async function MoviesPage() {
  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Movies"
        description={
          <>
            <p>
              This is where I log all the movies and TV series I’ve watched. I’m a huge fan of{' '}
              <span className="font-medium">Tom Hanks</span> and{' '}
              <span className="font-medium">Christopher Nolan</span>, so expect to see a lot of them
              in the top spots! Anything I’ve rated 10 stars is something I absolutely love and have
              probably rewatched many times (highly recommended). Take a look and maybe find your
              next favorite film!
            </p>
            <p className="mt-3 italic">
              *Data is exported from my{' '}
              <Link href={SITE_METADATA.imdbRatingsList} className="font-medium">
                <GrowingUnderline data-umami-event="goodreads-feed" active>
                  IMDB ratings list
                </GrowingUnderline>
              </Link>
              , with extra details pulled in from the{' '}
              <Link href="https://www.omdbapi.com/" className="font-medium">
                <GrowingUnderline data-umami-event="goodreads-feed" active>
                  OMDB API
                </GrowingUnderline>
              </Link>{' '}
              for a more complete look at each movie.
            </p>
          </>
        }
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="py-5 md:py-10">
        <Suspense>
          <MoviesList movies={movies as unknown as ImdbMovie[]} />
        </Suspense>
      </div>
    </Container>
  )
}
