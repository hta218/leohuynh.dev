import type { PaginationProps } from '~/types'
import { Link } from './Link'

// TODO: re-check PaginationProps types
export function Pagination({ totalPages, currentPage }: PaginationProps) {
  // const hasPrevPage = parseInt(currentPage) - 1 > 0
  // const hasNextPage = parseInt(currentPage) + 1 <= parseInt(totalPages)
  let hasPrevPage = currentPage - 1 > 0
  let hasNextPage = currentPage + 1 <= totalPages

  return (
    <div className="pt-6 pb-8 space-y-2 md:space-y-5">
      <nav className="flex justify-between">
        {!hasPrevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!hasPrevPage}>
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
          <button className="cursor-auto disabled:opacity-50" disabled={!hasNextPage}>
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
