import { GradientBorder } from '~/components/ui/gradient-border'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Image, Zoom } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import type { SelectMovie } from '~/db/schema'
import { Ratings } from './ratings'

function getLargePoster(poster: string, size = 1000) {
  return poster.replace('._V1_SX300', `._V1_SX${size}`)
}

export function MovieCard({ movie }: { movie: SelectMovie }) {
  let { url, title, titleType, poster, year, runtime, totalSeasons } = movie

  function handleZoom(e: React.MouseEvent<HTMLDivElement>) {
    let rmiz = e.currentTarget.querySelector('[data-rmiz]')
    let modalId = rmiz?.getAttribute('aria-owns')?.split('-').pop()
    if (modalId) {
      let zoomedPoster = document.getElementById(`rmiz-modal-img-${modalId}`)
      if (zoomedPoster) {
        zoomedPoster.removeAttribute('srcset')
      }
    }
  }

  return (
    <GradientBorder className="space-y-2 rounded-xl shadow-xs dark:bg-white/5">
      <TiltedGridBackground className="inset-0 z-[-1]" />
      <div className="flex gap-5 md:gap-5">
        <div
          onClick={handleZoom}
          className="-mt-12 mb-4 ml-4 flex h-52 w-36 shrink-0 items-end md:-mt-16 md:h-56"
        >
          <Zoom
            zoomImg={{ src: getLargePoster(poster), alt: title }}
            canSwipeToUnzoom={false} // Not working
          >
            <Image
              src={poster}
              alt={title}
              width={300}
              height={450}
              className="h-auto w-full rounded-lg shadow-[rgba(13,38,76,0.19)_0px_9px_20px]"
            />
          </Zoom>
        </div>
        <div className="relative flex grow flex-col gap-1 overflow-hidden pt-2 pr-2 pb-4 md:pr-4">
          <div className="flex items-start justify-between gap-3 text-xl font-semibold md:text-2xl">
            <Link href={url}>
              <GrowingUnderline>{title}</GrowingUnderline>
            </Link>
          </div>
          <div className="grow">
            <div className="flex flex-wrap items-center gap-1 text-gray-500 dark:text-gray-400">
              <span>
                {year}
                {titleType === 'Movie' && ` - ${formatRuntime(runtime)}`}
              </span>
              <span className="hidden md:inline">
                {titleType === 'TV Series' && <span> - (TV series / {totalSeasons} seasons)</span>}
              </span>
            </div>
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
