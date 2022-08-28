import Script from 'next/script'
import { siteMetadata } from '~/data'

export function UmamiScript() {
  return (
    <Script
      async
      defer
      data-website-id={siteMetadata.analytics.umamiWebsiteId}
      // Replace with umami instance
      src="https://umami.example.com/umami.js"
    />
  )
}
