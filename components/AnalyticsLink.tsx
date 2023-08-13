import { siteMetadata } from '~/data/siteMetadata'
import { AreaChart } from 'lucide-react'

export function AnalyticsLink() {
  return (
    <button
      aria-label="Open analytics"
      type="button"
      className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700"
      data-umami-event="nav-analytics"
      onClick={() => window.open(siteMetadata.analyticsURL, '_blank')}
    >
      <AreaChart strokeWidth={1.5} size={20} />
    </button>
  )
}
