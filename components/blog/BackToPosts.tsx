import { MoveLeft } from 'lucide-react'
import { Link } from '../Link'

export function BackToPosts({ page }: { page: number }) {
  return (
    <Link
      href={`/blog/page/${page}`}
      className="flex gap-3 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
    >
      <MoveLeft strokeWidth={1} />
      <span>Back to the blog</span>
    </Link>
  )
}
