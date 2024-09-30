import type { MetadataRoute } from 'next'
import { SITE_METADATA } from '~/data/site-metadata'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_METADATA.siteUrl}/sitemap.xml`,
    host: SITE_METADATA.siteUrl,
  }
}
