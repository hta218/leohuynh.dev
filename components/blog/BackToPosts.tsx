import { Link } from '~/components'

export function BackToPosts({ page }: { page: number }) {
  return (
    <Link
      href={`/blog/page/${page}`}
      className="flex text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
    >
      <svg viewBox="0 -9 3 24" className="overflow-visible mr-3 w-auto h-6">
        <path
          d="M3 0L0 3L3 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
      Back to the blog
    </Link>
  )
}
