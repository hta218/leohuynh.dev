import siteMetadata from '@/data/siteMetadata'
import Link from '~/components/Link'
import Twemoji from '~/components/Twemoji'

const LINKS = [
  {
    title: `What have I built?`,
    href: `/projects`,
    emoji: 'hammer-and-wrench',
    event: 'home-link-projects',
  },
  {
    title: `My writings`,
    href: `/blog`,
    emoji: 'memo',
    event: 'home-link-blog',
  },
  {
    title: `My snippets collection`,
    href: `/snippets`,
    emoji: 'dna',
    event: 'home-link-snippets',
  },
  {
    title: `More about me & myself`,
    href: `/about`,
    emoji: 'face-with-monocle',
    event: 'home-link-about',
  },
  {
    title: `My career`,
    href: `/resume`,
    emoji: 'briefcase',
    event: 'home-link-resume',
  },
  {
    title: `Traffic & engagement of this site`,
    href: siteMetadata.analyticsUrl,
    emoji: 'bar-chart',
    event: 'home-link-analytics',
  },
]

export function BlogLinks() {
  return (
    <div className="flex flex-col gap-3">
      {LINKS.map(({ title, href, emoji, event }) => (
        <Link
          key={title}
          href={href}
          className="flex items-center underline-offset-4 hover:underline"
        >
          <Twemoji emoji={emoji} />
          <span data-umami-event={event} className="ml-1.5 leading-6">
            {title}
          </span>
        </Link>
      ))}
    </div>
  )
}
