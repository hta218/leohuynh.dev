import Link from 'next/link'
import { kebabCase } from '~/utils'

export function Tag({ text }: { text: string }) {
  return (
    <Link
      href={`/tags/${kebabCase(text)}`}
      className="mr-3 text-sm md:text-base font-medium dark:text-primary-400 text-primary-500 hover:text-primary-600 dark:hover:text-primary-300"
    >
      #{text.split(' ').join('-')}
    </Link>
  )
}
