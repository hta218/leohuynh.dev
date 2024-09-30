import { NewsletterAPI } from 'pliny/newsletter'
import { SITE_METADATA } from '~/data/site-metadata'

const handler = NewsletterAPI({
  // @ts-ignore
  provider: SITE_METADATA.newsletter.provider,
})

export { handler as GET, handler as POST }
