import type { PaginationType } from '~/types/server'
import { Link } from './Link'
import { useTranslation } from 'next-i18next'

export function Pagination({ totalPages, currentPage }: PaginationType) {
  let hasPrevPage = currentPage - 1 > 0
  let hasNextPage = currentPage + 1 <= totalPages
  let { t } = useTranslation('common')

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!hasPrevPage && (
          <button
            className="cursor-auto disabled:opacity-50"
            disabled={!hasPrevPage}
            data-umami-event="prev-posts"
          >
            {t('pagination.previous')}
          </button>
        )}
        {hasPrevPage && (
          <Link href={currentPage - 1 === 1 ? `/blog/` : `/blog/page/${currentPage - 1}`}>
            <button>{t('pagination.previous')}</button>
          </Link>
        )}
        <span>
          {currentPage} {t('pagination.of')} {totalPages}
        </span>
        {!hasNextPage && (
          <button
            className="cursor-auto disabled:opacity-50"
            disabled={!hasNextPage}
            data-umami-event="next-posts"
          >
            {t('pagination.next')}
          </button>
        )}
        {hasNextPage && (
          <Link href={`/blog/page/${currentPage + 1}`}>
            <button>{t('pagination.next')}</button>
          </Link>
        )}
      </nav>
    </div>
  )
}
