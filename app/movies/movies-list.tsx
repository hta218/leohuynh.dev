'use client'

import { useSearchParams } from 'next/navigation'
import { MovieCard } from '~/components/cards/movie'
import { Twemoji } from '~/components/ui/twemoji'
import type { ImdbMovie } from '~/types/data'
import { RateFilter, RATES, type RateType } from './rate-filter'
import { TitleTypeFilter, type TitleType } from './title-type-filter'

const MOVIES_TITLE_TYPES: Record<TitleType, string> = {
  all: 'All',
  movie: 'Movie',
  'tv-series': 'TV Series',
}

export function MoviesList({ movies }: { movies: ImdbMovie[] }) {
  let searchParams = useSearchParams()
  let rate = (searchParams.get('rate') as RateType) || '10'
  let type = (searchParams.get('type') as TitleType) || 'all'

  let displayMovies = movies
    .filter((movie) => {
      if (type === 'all' || MOVIES_TITLE_TYPES[type] === movie.title_type) {
        if (rate === '<=6') {
          return Number(movie.your_rating) <= 6
        }
        return movie.your_rating === rate
      }
    })
    .sort((m1, m2) => {
      if (m1.your_rating === m2.your_rating) {
        return Number(m2.imdb_rating) - Number(m1.imdb_rating)
      }
      return Number(m2.your_rating) - Number(m1.your_rating)
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
      <div className="grid grid-cols-1 gap-4 gap-x-6 gap-y-[4.5rem] pt-16 md:grid-cols-2 md:gap-y-20">
        {displayMovies.length ? (
          displayMovies.map((movie) => {
            return <MovieCard movie={movie} key={movie.const} />
          })
        ) : (
          <div className="text-base">No movies found</div>
        )}
      </div>
    </div>
  )
}
