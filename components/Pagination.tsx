import type { PaginationType } from '~/types'
import { Link } from './Link'

export function Pagination({ totalPages, currentPage }: PaginationType) {
  let hasPrevPage = currentPage - 1 > 0
  let hasNextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!hasPrevPage && (
          <button
            className="cursor-auto disabled:opacity-50"
            disabled={!hasPrevPage}
            data-umami-event="prev-posts"
          >
            Previous
          </button>
        )}
        {hasPrevPage && (
          <Link href={currentPage - 1 === 1 ? `/blog/` : `/blog/page/${currentPage - 1}`}>
            <button>Previous</button>
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!hasNextPage && (
          <button
            className="cursor-auto disabled:opacity-50"
            disabled={!hasNextPage}
            data-umami-event="next-posts"
          >
            Next
          </button>
        )}
        {hasNextPage && (
          <Link href={`/blog/page/${currentPage + 1}`}>
            <button>Next</button>
          </Link>
        )}
      </nav>
    </div>
  )
}
