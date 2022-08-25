import fetcher from '~libs/fetcher'
import { useEffect } from 'react'
const { default: useSWR } = require('swr')

export default function ViewCounter({ slug, className }) {
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
