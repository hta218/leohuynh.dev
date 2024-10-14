import { Link } from '~/components/ui/link'
import { Twemoji } from '~/components/ui/twemoji'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { SITE_METADATA } from '~/data/site-metadata'

const LINKS = [
  {
    title: `What have I built?`,
    href: `/projects`,
    emoji: 'man-technologist',
    event: 'home-link-projects',
  },
  {
    title: `My writings`,
    href: `/blog`,
    emoji: 'memo',
    event: 'home-link-blog',
  },
  {
    title: `Snippets collection`,
    href: `/snippets`,
    emoji: 'dna',
    event: 'home-link-snippets',
  },
  {
    title: `About me & this blog`,
    href: `/about`,
    emoji: 'smiling-face-with-sunglasses',
    event: 'home-link-about',
  },
  {
    title: `Traffic and insights`,
    href: SITE_METADATA.analytics.umamiAnalytics.shareUrl,
    emoji: 'bar-chart',
    event: 'home-link-analytics',
  },
]

export function BlogLinks() {
  return (
    <div className="flex flex-col gap-2.5 md:gap-3">
      {LINKS.map(({ title, href, emoji, event }) => (
        <Link key={title} href={href} className="flex items-center gap-1.5">
          <Twemoji emoji={emoji} />
          <GrowingUnderline data-umami-event={event} className="leading-6">
            {title}
          </GrowingUnderline>
        </Link>
      ))}
    </div>
  )
}
