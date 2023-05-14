import { siteMetadata } from '~/data/siteMetadata'

export function AnalyticsLink() {
  return (
    <button
      aria-label="Open analytics"
      type="button"
      className="ml-1 rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700 sm:ml-2"
      data-umami-event="nav-analytics"
      onClick={() => window.open(siteMetadata.analyticsURL, '_blank')}
    >
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="h-5 w-5 text-gray-900 dark:text-gray-100"
      >
        <path d="M1.019 13.019h3.849V24h-3.85zm8.943-6.68h3.85V24h-3.85zM19.132 0h3.85v24h-3.85z" />
      </svg>
    </button>
  )
}
