import { SITE_METADATA } from './site-metadata'

export const HEADER_NAV_LINKS = [
  { href: '/blog', title: 'Blog', emoji: 'writing-hand' },
  { href: '/snippets', title: 'Snippets', emoji: 'dna' },
  { href: '/projects', title: 'Projects', emoji: 'man-technologist' },
  { href: '/about', title: 'About', emoji: 'billed-cap' },
]

export const MORE_NAV_LINKS = [
  { href: '/books', title: 'Books', emoji: 'books' },
  { href: '/movies', title: 'Movies', emoji: 'film-frames' },
  { href: '/tags', title: 'Tags', emoji: 'label' },
]

export const FOOTER_NAV_LINKS = [
  { href: '/blog', title: 'Blog' },
  { href: '/snippets', title: 'Snippets' },
  { href: '/projects', title: 'Projects' },
  { href: '/tags', title: 'Tags' },
  { href: '/feed.xml', title: 'RSS Feed' },
]

export const FOOTER_PERSONAL_STUFF = [
  { href: '/about', title: 'About' },
  { href: '/static/resume.pdf', title: 'Resume' },
  { href: '/books', title: 'Books' },
  { href: '/movies', title: 'Movies' },
  { href: SITE_METADATA.analytics.umamiAnalytics.shareUrl, title: 'Analytics' },
]
