import { useEffect } from 'react'
import { fetcher } from '~/libs'
import type { ViewCounterProps } from '~/types'
const { default: useSWR } = require('swr')

export function ViewCounter({ slug, className }: ViewCounterProps) {
  let { data } = useSWR(`/api/views/${slug}`, fetcher)
  let views = new Number(data?.total)

  useEffect(() => {
    let registerView = () =>
      fetch(`/api/views/${slug}`, {
        method: 'POST',
      })

    registerView()
  }, [slug])

  return <span className={className}>{`${views > 0 ? views.toLocaleString() : '–––'} views`}</span>
}
