import { clsx } from 'clsx'
import { type Snippet } from 'contentlayer/generated'
import type { BrandsMap } from '~/components/ui/brand'
import { Brand } from '~/components/ui/brand'
import { GradientBorder } from '~/components/ui/gradient-border'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import type { CoreContent } from '~/types/data'

export function SnippetCard({ snippet }: { snippet: CoreContent<Snippet> }) {
  let { icon, heading, summary, title, path } = snippet
  return (
    <GradientBorder className="rounded-2xl">
      <Link
        href={`/${path}`}
        title={title}
        className={clsx([
          'relative flex h-full rounded-2xl',
          'bg-zinc-50 dark:bg-white/5',
          'transition-shadow hover:shadow-md',
          'hover:shadow-zinc-900/5 dark:hover:shadow-black/15',
        ])}
      >
        <TiltedGridBackground className="inset-0" />
        <Brand
          name={icon as keyof typeof BrandsMap}
          as="icon"
          className="absolute -top-5 left-4 z-10 h-12 w-12 text-gray-900 dark:text-white"
        />
        <div className="relative w-full px-4 pb-6 pt-6">
          <h3 className="mt-4 text-xl font-semibold leading-7">
            <GrowingUnderline>{heading}</GrowingUnderline>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-zinc-600 dark:text-zinc-400">{summary}</p>
        </div>
      </Link>
    </GradientBorder>
  )
}
