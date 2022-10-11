import type { SnippetFrontMatter } from '~/types'
import { DevIcon } from './DevIcon'
import { Link } from './Link'

export function SnippetCard({ snippet }: { snippet: SnippetFrontMatter }) {
  let { type, heading, summary, title, slug } = snippet

  return (
    <Link href={`/snippets/${slug}`} title={title}>
      <div className="flex rounded border dark:hover:border-gray-400 dark:border-gray-600 border-gray-300 hover:border-gray-500 cursor-pointer mb-4 lg:mb-0">
        <div className="p-3 lg:p-4">
          <DevIcon type={type} />
        </div>
        <div className="p-3 lg:p-4 md:p-4 overflow-hidden">
          <h3 className="text-lg lg:text-2xl font-bold leading-8 tracking-tight whitespace-nowrap overflow-hidden overflow-ellipsis">
            {heading}
          </h3>
          <p className="text-md lg:text-base mt-2 text-gray-700 dark:text-gray-400">{summary}</p>
        </div>
      </div>
    </Link>
  )
}
