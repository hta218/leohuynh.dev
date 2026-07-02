import { SITE } from './site'

/** `BreadcrumbList` schema — powers the breadcrumb rich result in Google. */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** `BlogPosting` schema for post/snippet/note detail pages. */
export function articleJsonLd(opts: {
  title: string
  description?: string
  url: string
  image: string
  datePublished: string
  dateModified?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    image: opts.image,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: { '@type': 'Person', name: SITE.author, url: `${SITE.siteUrl}/whoami` },
    publisher: { '@type': 'Person', name: SITE.author },
    mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
  }
}

/** `WebSite` + `Person` schema for the homepage. */
export function siteJsonLd() {
  const author = {
    '@type': 'Person',
    name: SITE.author,
    url: `${SITE.siteUrl}/whoami`,
    sameAs: [
      SITE.github,
      SITE.x,
      SITE.linkedin,
      SITE.instagram,
      SITE.threads,
      SITE.youtube,
      SITE.facebook,
    ],
  }
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE.headerTitle,
      url: SITE.siteUrl,
      description: SITE.description,
      author,
    },
    { '@context': 'https://schema.org', ...author },
  ]
}
