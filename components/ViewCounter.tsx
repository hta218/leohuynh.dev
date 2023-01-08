import { useEffect } from 'react'
import type { ViewApiResponse, ViewCounterProps } from '~/types'
import { fetcher } from '~/utils/fetcher'
const { default: useSWR } = require('swr')

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

  return <span className={className}>{`${views > 0 ? views.toLocaleString() : '–––'} views`}</span>
}
