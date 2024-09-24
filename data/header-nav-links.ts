import { SITE_METADATA } from './site-metadata'

export const HEADER_NAV_LINKS = [
  { href: '/blog', title: 'Blog' },
  { href: '/snippets', title: 'Snippets' },
  { href: '/projects', title: 'Projects' },
  { href: '/about', title: 'About' },
]

export const MORE_NAV_LINKS = [
  { href: '/books', title: 'Books', emoji: 'books' },
  { href: '/movies', title: 'Movies', emoji: 'clapper-board' },
  { href: '/tags', title: 'Tags', emoji: 'label' },
  { href: SITE_METADATA.analyticsUrl, title: 'Blog stats', emoji: 'bar-chart' },
]
