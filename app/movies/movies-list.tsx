'use client'

import { useState } from 'react'
import { MovieCard } from '~/components/cards/movie'
import type { ImdbMovie } from '~/types/data'
import { RateFilter, RATES, type RateType } from './rate-filter'
import { Twemoji } from '~/components/ui/twemoji'
import { TitleTypeFilter, type TitleType } from './title-type-filter'

export function MoviesList({ movies }: { movies: ImdbMovie[] }) {
  let [rate, setRate] = useState<RateType>('10')
  let [type, setType] = useState<TitleType>('All')

  let displayMovies = movies
    .filter((movie) => {
      if (type === 'All' || type === movie.title_type) {
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
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2 text-lg font-medium md:text-xl">
          <Twemoji emoji={emoji} /> {description}{' '}
          <span className="font-normal text-gray-600 dark:text-gray-400">
            ({displayMovies.length} titles)
          </span>
        </div>
        <div className="flex gap-5">
          <div className="flex items-center gap-2">
            Type: <TitleTypeFilter type={type} setType={setType} />
          </div>
          <div className="flex items-center gap-2">
            My rate: <RateFilter rate={rate} setRate={setRate} />
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
