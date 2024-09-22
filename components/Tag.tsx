import Link from 'next/link'
import { slug } from 'github-slugger'
import { clsx } from 'clsx'

function Tag({ text, size = 'sm' }: { text: string; size?: 'sm' | 'md' }) {
  let tagName = text.split(' ').join('-')
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className={clsx([
        'rounded-lg px-2 py-0.5 font-semibold',
        'bg-slate-100 text-gray-600 hover:text-gray-800',
        'dark:bg-gray-700 dark:text-gray-300',
        size === 'sm' ? 'text-sm' : 'text-base',
      ])}
    >
      <span data-umami-event={`tag-${tagName}`}>#{tagName}</span>
    </Link>
  )
}

export default Tag
