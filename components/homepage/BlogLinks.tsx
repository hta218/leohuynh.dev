import siteMetadata from '@/data/siteMetadata'
import Link from '../Link'
import Twemoji from '../Twemoji'

export function BlogLinks() {
  return (
    <div className="flex flex-col space-y-1.5">
      <Link href="/projects" className="underline-offset-4 hover:underline">
        <Twemoji emoji="hammer-and-wrench" />
        <span data-umami-event="home-link-projects" className="ml-1.5">
          What have I built?
        </span>
      </Link>
      <Link href="/blog" className="underline-offset-4 hover:underline">
        <Twemoji emoji="memo" />
        <span data-umami-event="home-link-blog" className="ml-1.5">
          My writings
        </span>
      </Link>
      <Link href="/snippets" className="underline-offset-4 hover:underline">
        <Twemoji emoji="dna" />
        <span data-umami-event="home-link-snippets" className="ml-1.5">
          My snippets collection
        </span>
      </Link>
      <Link href="/about" className="underline-offset-4 hover:underline">
        <Twemoji emoji="face-with-monocle" />
        <span data-umami-event="home-link-about" className="ml-1.5">
          More about me & myself
        </span>
      </Link>
      <Link href="/resume" className="underline-offset-4 hover:underline">
        <Twemoji emoji="briefcase" />
        <span data-umami-event="home-link-resume" className="ml-1.5">
          My career
        </span>
      </Link>
      <Link href={siteMetadata.analyticsUrl} className="underline-offset-4 hover:underline">
        <Twemoji emoji="bar-chart" />
        <span data-umami-event="home-link-analytics" className="ml-1.5">
          Traffic & engagement of this site
        </span>
      </Link>
    </div>
  )
}
