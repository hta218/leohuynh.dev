import { AreaChart } from 'lucide-react'
import { Link } from '~/components/ui/link'
import { SITE_METADATA } from '~/data/site-metadata'

export function AnalyticsLink() {
  return (
    <Link
      href={SITE_METADATA.analytics.umamiAnalytics.shareUrl}
      aria-label="Open analytics"
      className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700"
      data-umami-event="nav-analytics"
    >
      <AreaChart strokeWidth={1.5} size={22} />
    </Link>
  )
}
