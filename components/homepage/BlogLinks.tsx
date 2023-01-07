import { siteMetadata } from '~/data/siteMetadata'
import { Link } from '../Link'
import { Twemoji } from '../Twemoji'

export function BlogLinks() {
  return (
    <div className="flex flex-col space-y-1">
      <Link href="/projects" className="hover:underline">
        <Twemoji emoji="hammer-and-wrench" />
        <span className="ml-2">What have I built?</span>
      </Link>
      <Link href="/blog" className="hover:underline">
        <Twemoji emoji="memo" />
        <span className="ml-2">My writings</span>
      </Link>
      <Link href="/snippets" className="hover:underline">
        <Twemoji emoji="dna" />
        <span className="ml-2">My snippets collection</span>
      </Link>
      <Link href="/about" className="hover:underline">
        <Twemoji emoji="face-with-monocle" />
        <span className="ml-2">More about me & this blog</span>
      </Link>
      <Link href="/resume" className="hover:underline">
        <Twemoji emoji="briefcase" />
        <span className="ml-2">My career</span>
      </Link>
      <Link href={siteMetadata.analyticsURL} className="hover:underline">
        <Twemoji emoji="bar-chart" />
        <span className="ml-2">Traffic & engagement</span>
      </Link>
    </div>
  )
}
