import { SnippetCard } from '~/components'
import type { SnippetLayoutProps } from '~/types'

export function SnippetLayout({ snippets, description }: SnippetLayoutProps) {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="pt-6 pb-8 space-y-2 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Snippets
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <div className="container py-12">
        <div className="lg:grid grid-cols-2 gap-6">
          {snippets.map((snippet) => (
            <SnippetCard key={snippet.title} snippet={snippet} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SnippetLayout
