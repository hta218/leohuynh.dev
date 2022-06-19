import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer>
      <div className="flex flex-col items-center mt-16 mb-8">
        <div className="flex mb-3 space-x-4">
          <SocialIcon kind="github" href={siteMetadata.github} size="6" />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size="6" />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size="6" />
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size="6" />
          <SocialIcon kind="facebook" href={siteMetadata.facebook} size="6" />
          <SocialIcon kind="youtube" href={siteMetadata.youtube} size="6" />
        </div>
        <div className="flex my-2 space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{`Copyright © ${new Date().getFullYear()}`}</div>
          <span>{` • `}</span>
          <Link href="/">{siteMetadata.footerTitle}</Link>
        </div>
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
      </div>
    </footer>
  )
}
