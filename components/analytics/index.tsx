import { siteMetadata } from '~/data'
import { GAScript } from './GoogleAnalytics'
import { SimpleAnalyticsScript } from './SimpleAnalytics'
import { UmamiScript } from './Umami'

let isProduction = process.env.NODE_ENV === 'production'

export function Analytics() {
  let { analytics } = siteMetadata
  let { simpleAnalytics, umamiWebsiteId, googleAnalyticsId } = analytics
  return (
    <>
      {isProduction && simpleAnalytics && <SimpleAnalyticsScript />}
      {isProduction && umamiWebsiteId && <UmamiScript />}
      {isProduction && googleAnalyticsId && <GAScript />}
    </>
  )
}
