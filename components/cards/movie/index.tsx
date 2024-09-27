import { GradientBorder } from '~/components/ui/gradient-border'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import type { ImdbMovie } from '~/types/data'
import { Ratings } from './ratings'

export function MovieCard({ movie }: { movie: ImdbMovie }) {
  let { url, title, poster, year, runtime } = movie
  return (
    <GradientBorder className="space-y-2 rounded-2xl">
      <TiltedGridBackground className="inset-0 z-[-1]" />
      <div className="flex gap-4 md:gap-5">
        <div className="-mt-12 mb-4 ml-4 flex h-52 w-36 shrink-0 items-end md:-mt-16 md:h-56">
          <Image
            src={poster}
            alt={title}
            width={300}
            height={450}
            className="h-auto w-full rounded-md shadow-lg"
          />
        </div>
        <div className="relative flex grow flex-col gap-1 overflow-hidden pb-4 pr-4 pt-2">
          <div className="flex items-start justify-between gap-3 text-xl font-semibold md:text-2xl">
            <Link href={url}>
              <GrowingUnderline>{title}</GrowingUnderline>
            </Link>
          </div>
          <div className="grow text-gray-500">
            <span>
              {year} - {formatRuntime(runtime)}
            </span>
          </div>
          <Ratings movie={movie} />
        </div>
      </div>
    </GradientBorder>
  )
}

function formatRuntime(runtime: string) {
  let _mins = Number(runtime)
  let hours = Math.floor(_mins / 60)
  let mins = _mins % 60
  return `${hours}h ${mins < 10 ? '0' : ''}${mins}m`
}
