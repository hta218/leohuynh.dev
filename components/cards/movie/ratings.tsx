import { Brand } from '~/components/ui/brand'
import { Link } from '~/components/ui/link'
import type { ImdbMovie } from '~/types/data'

export function Ratings({ movie }: { movie: ImdbMovie }) {
  let { imdb_rating, ratings, url, title, num_votes } = movie
  let { value: rotten_rating } = ratings.find(({ source }) => source === 'Rotten Tomatoes') || {
    value: 0,
  }
  let rottenSearchUrl = new URL(`https://www.rottentomatoes.com/search`)
  rottenSearchUrl.searchParams.set('search', title)

  return (
    <div className="flex items-center gap-4">
      <Link href={url} className="flex items-center gap-1.5 md:gap-2">
        <Brand name="IMBb" className="h-5 w-5 md:h-6 md:w-6" as="icon" />
        <span>
          {imdb_rating}{' '}
          <span className="hidden text-gray-500 dark:text-gray-400 md:inline">
            ({shortenNumVotes(Number(num_votes))})
          </span>
        </span>
      </Link>
      <Link href={rottenSearchUrl.toString()} className="flex items-center gap-1.5 md:gap-2">
        <Brand name="RottenTomatoes" as="icon" className="h-5 w-5 md:h-6 md:w-6" />
        <span>{rotten_rating || 'N/A'}</span>
      </Link>
    </div>
  )
}

function shortenNumVotes(n: number, suffix = '') {
  let suffixes = ['', 'K', 'M', 'B', 'T']
  if (n < 1000) {
    let fixedPoint = n.toFixed(1)
    if (fixedPoint.endsWith('.0')) {
      return n.toFixed(0) + suffix
    }
    return n.toFixed(1) + suffix
  }
  let index = suffix ? suffixes.indexOf(suffix) + 1 : 1
  return shortenNumVotes(n / 1000, suffixes[index])
}
