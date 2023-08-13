import Link from 'next/link'
import { kebabCase } from '~/utils/string'

export function Tag({ text }: { text: string }) {
  return (
    <Link
      href={`/tags/${kebabCase(text)}`}
      className="mr-3 text-sm font-medium text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 md:text-base"
    >
      <span data-umami-event="tag">#{text.split(' ').join('-')}</span>
    </Link>
  )
}
