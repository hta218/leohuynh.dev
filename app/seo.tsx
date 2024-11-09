import type { Metadata } from 'next'
import { SITE_METADATA } from '~/data/site-metadata'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  [key: string]: any
}

export function genPageMetadata({ title, description, image, ...rest }: PageSEOProps): Metadata {
  return {
    title,
    description: description || SITE_METADATA.description,
    openGraph: {
      title: `${title} | ${SITE_METADATA.title}`,
      description: description || SITE_METADATA.description,
      url: './',
      siteName: SITE_METADATA.title,
      images: image ? [image] : [SITE_METADATA.socialBanner],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${SITE_METADATA.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [SITE_METADATA.socialBanner],
    },
    ...rest,
  }
}
