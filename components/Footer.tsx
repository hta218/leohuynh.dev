import { siteMetadata } from '~/data'
import { Link } from './Link'
import { SocialIcon } from './SocialIcon'

export function Footer() {
  return (
    <footer>
      <div className="flex flex-col items-center mt-16 mb-8">
        <div className="flex mb-3 space-x-4">
          <SocialIcon name="Github" href={siteMetadata.github} />
          <SocialIcon name="Twitter" href={siteMetadata.twitter} />
          <SocialIcon name="Linkedin" href={siteMetadata.linkedin} />
          <SocialIcon name="Mail" href={`mailto:${siteMetadata.email}`} />
          <SocialIcon name="Facebook" href={siteMetadata.facebook} />
          <SocialIcon name="Youtube" href={siteMetadata.youtube} />
        </div>
        <div className="flex my-2 space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{`Copyright © ${new Date().getFullYear()}`}</div>
          <span>{` • `}</span>
          <Link href="/">{siteMetadata.footerTitle}</Link>
        </div>
        <Credit />
      </div>
    </footer>
  )
}

function Credit() {
  return (
    <div className="text-sm text-gray-500 dark:text-gray-400">
      <span className="font-bold">Credit : </span>
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-blue-500"
        href="https://github.com/timlrx/tailwind-nextjs-starter-blog"
      >
        Tailwind Nextjs Theme
      </a>
      <span> by </span>
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-blue-500"
        href="https://twitter.com/timlrxx"
      >
        Timothy Lin
      </a>
    </div>
  )
}
