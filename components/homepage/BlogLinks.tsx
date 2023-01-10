import { siteMetadata } from '~/data/siteMetadata'
import { Link } from '../Link'
import { Twemoji } from '../Twemoji'

export function BlogLinks() {
  return (
    <div className="flex flex-col space-y-2">
      <Link href="/projects" className="flex hover:underline">
        <Twemoji emoji="hammer-and-wrench" />
        <span className="umami--click--home-link-projects ml-2.5">What have I built?</span>
      </Link>
      <Link href="/blog" className="flex hover:underline">
        <Twemoji emoji="memo" />
        <span className="umami--click--home-link-blog ml-2.5">My writings</span>
      </Link>
      <Link href="/snippets" className="flex hover:underline">
        <Twemoji emoji="dna" />
        <span className="umami--click--home-link-snippets ml-2.5">My snippets collection</span>
      </Link>
      <Link href="/about" className="flex hover:underline">
        <Twemoji emoji="face-with-monocle" />
        <span className="umami--click--home-link-about ml-2.5">More about me and myself</span>
      </Link>
      <Link href="/resume" className="flex hover:underline">
        <Twemoji emoji="briefcase" />
        <span className="umami--click--home-link-resume ml-2.5">My career</span>
      </Link>
      <Link href={siteMetadata.analyticsURL} className="flex hover:underline">
        <Twemoji emoji="bar-chart" />
        <span className="umami--click--home-link-analytics ml-2.5">
          Traffic & engagement of this site
        </span>
      </Link>
    </div>
  )
}
