import type { PaginationType } from '~/types'
import { Link } from './Link'

export function Pagination({ totalPages, currentPage }: PaginationType) {
  let hasPrevPage = currentPage - 1 > 0
  let hasNextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!hasPrevPage && (
          <button
            className="umami--click--prev-posts cursor-auto disabled:opacity-50"
            disabled={!hasPrevPage}
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
            className="umami--click--next-posts cursor-auto disabled:opacity-50"
            disabled={!hasNextPage}
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
