import Link from 'next/link'
import { slug } from 'github-slugger'

function Tag({ text }: { text: string }) {
  let tagName = text.split(' ').join('-')
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="rounded-lg bg-slate-100 px-2 py-0.5 text-sm font-semibold text-gray-600 hover:text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    >
      <span data-umami-event={`tag-${tagName}`}>#{tagName}</span>
    </Link>
  )
}

export default Tag
