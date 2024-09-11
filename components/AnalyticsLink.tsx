import siteMetadata from '@/data/siteMetadata'
import { AreaChart } from 'lucide-react'
import Link from './Link'

export function AnalyticsLink() {
  return (
    <Link
      href={siteMetadata.analyticsUrl}
      aria-label="Open analytics"
      className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700"
      data-umami-event="nav-analytics"
    >
      <AreaChart strokeWidth={1.5} size={22} />
    </Link>
  )
}
