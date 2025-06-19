'use client'

import { useSearchParams } from 'next/navigation'
import { MovieCard } from '~/components/cards/movie'
import { Twemoji } from '~/components/ui/twemoji'
import type { SelectMovie } from '~/db/schema'
import { RATES, RateFilter, type RateType } from './rate-filter'
import { type TitleType, TitleTypeFilter } from './title-type-filter'

const MOVIES_TITLE_TYPES: Record<TitleType, string> = {
  all: 'All',
  movie: 'Movie',
  'tv-series': 'TV Series',
}

export function MoviesList({ movies }: { movies: SelectMovie[] }) {
  let searchParams = useSearchParams()
  let rate = (searchParams.get('rate') as RateType) || '10'
  let type = (searchParams.get('type') as TitleType) || 'all'

  let displayMovies = movies
    .filter((movie) => {
      if (type === 'all' || MOVIES_TITLE_TYPES[type] === movie.titleType) {
        if (rate === '<=6') {
          return Number(movie.yourRating) <= 6
        }
        return movie.yourRating === rate
      }
    })
    .sort((m1, m2) => {
      if (m1.yourRating === m2.yourRating) {
        return Number(m2.imdbRating) - Number(m1.imdbRating)
      }
      return Number(m2.yourRating) - Number(m1.yourRating)
    })
  let { description, emoji } = RATES.find(({ value }) => value === rate) || RATES[0]

  return (
    <div className="space-y-4 pt-2 md:space-y-6 md:pt-0">
      <div className="flex flex-col-reverse items-center justify-between gap-5 md:flex-row md:gap-4">
        <div className="flex items-center gap-2 text-xl font-medium">
          <Twemoji emoji={emoji} /> {description}{' '}
          <span className="font-normal text-gray-600 dark:text-gray-400">
            ({displayMovies.length} titles)
          </span>
        </div>
        <div className="flex gap-5">
          <div className="flex items-center gap-2">
            <span>Type: </span>
            <TitleTypeFilter type={type} rate={rate} />
          </div>
          <div className="flex items-center gap-2">
            <span>My rate: </span>
            <RateFilter type={type} rate={rate} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 gap-x-6 gap-y-18 pt-16 md:grid-cols-2 md:gap-y-20">
        {displayMovies.length ? (
          displayMovies.map((movie) => {
            return <MovieCard movie={movie} key={movie.id} />
          })
        ) : (
          <div className="text-base">No movies found</div>
        )}
      </div>
    </div>
  )
}
