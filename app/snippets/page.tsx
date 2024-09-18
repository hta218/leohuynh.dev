import { genPageMetadata } from 'app/seo'
import { clsx } from 'clsx'
import { allSnippets, type Snippet } from 'contentlayer/generated'
import { allCoreContent, sortPosts, type CoreContent } from 'pliny/utils/contentlayer'
import type { BrandsMap } from '~/components/Brands'
import { Brand } from '~/components/Brands'
import Container from '~/components/Container'
import { GradientBorder } from '~/components/gradient-border'
import { GrowingUnderline } from '~/components/growing-underline'
import Link from '~/components/Link'
import { PageHeader } from '~/components/page-header'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'

export let metadata = genPageMetadata({ title: 'Snippets' })

export default function Snippets() {
  let snippets = allCoreContent(sortPosts(allSnippets))

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Snippets"
        description="My collection of reusable code snippets that are useful for everyday tasks."
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="py-10">
        <div className="grid-cols-2 gap-x-6 gap-y-10 space-y-10 md:grid md:space-y-0">
          {snippets.map((snippet) => (
            <SnippetCard snippet={snippet} key={snippet.path} />
          ))}
        </div>
      </div>
    </Container>
  )
}

function SnippetCard({ snippet }: { snippet: CoreContent<Snippet> }) {
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
        <TiltedGridBackground />
        <Brand
          type={icon as keyof typeof BrandsMap}
          as="icon"
          className="absolute -top-5 left-4 z-10 h-12 w-12 text-gray-900 dark:text-white"
        />
        <div className="relative z-[1] w-full rounded-2xl px-4 pb-6 pt-6">
          <h3 className="mt-4 text-xl font-semibold leading-7">
            <GrowingUnderline>{heading}</GrowingUnderline>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-zinc-600 dark:text-zinc-400">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum corrupti dolorem
            aspernatur voluptas, adipisci pariatur magnam corporis blanditiis velit dicta neque qui
            minus ab at dolor vitae eligendi quaerat nihil.
          </p>
        </div>
      </Link>
    </GradientBorder>
  )
}
