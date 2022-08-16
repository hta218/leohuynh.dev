import { AnchorHTMLAttributes } from 'react'
import Facebook from './facebook.svg'
import Github from './github.svg'
import Linkedin from './linkedin.svg'
import Mail from './mail.svg'
import Twitter from './twitter.svg'
import Youtube from './youtube.svg'

// Icons from: https://simpleicons.org/

let SocialIconMap = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
}

function SocialIcon({
  kind,
  href,
  size = 8,
}: {
  kind: keyof typeof SocialIconMap
  href: string
  size?: number
}) {
  if (!href) return null

  let SocialSvg = SocialIconMap[kind]
  let attrs: AnchorHTMLAttributes<HTMLAnchorElement> = {
    href,
    rel: 'noopener noreferrer',
  }
  if (kind !== 'mail') {
    attrs.target = '_blank'
  }

  return (
    <a className="text-sm text-gray-500 transition hover:text-gray-600" {...attrs}>
      <span className="sr-only">{kind}</span>
      <SocialSvg
        className={`fill-current text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 h-${size} w-${size}`}
      />
    </a>
  )
}

export default SocialIcon
