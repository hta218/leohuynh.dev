import { clsx } from 'clsx'
import { slug } from 'github-slugger'
import { Link } from '~/components/ui/link'

export function TagsList({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {tags.map((tag) => (
        <Tag key={tag} text={tag} />
      ))}
    </div>
  )
}

export function Tag({ text, size = 'sm' }: { text: string; size?: 'sm' | 'md' }) {
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
