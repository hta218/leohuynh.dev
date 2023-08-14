import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import type { ViewCounterProps } from '~/types/components'
import type { ViewApiResponse } from '~/types/server'
import { fetcher } from '~/utils/fetcher'
let { default: useSWR } = require('swr')

export function ViewCounter({ slug, className }: ViewCounterProps) {
  let { data } = useSWR(`/api/views/${slug}`, fetcher) as ViewApiResponse
  let views = Number(data?.total)

  useEffect(() => {
    let registerView = () =>
      fetch(`/api/views/${slug}`, {
        method: 'POST',
      })

    registerView()
  }, [slug])

  let { t } = useTranslation('common')

  return (
    <span className={className}>
      {`${views > 0 ? views.toLocaleString() : '–––'} ${t('blog.views')}`}
    </span>
  )
}
