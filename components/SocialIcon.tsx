import type { AnchorHTMLAttributes } from 'react'
import type { SocialIconProps } from '~/types'
import Facebook from '~/icons/facebook.svg'
import Github from '~/icons/github.svg'
import Linkedin from '~/icons/linkedin.svg'
import Mail from '~/icons/mail.svg'
import Twitter from '~/icons/twitter.svg'
import Youtube from '~/icons/youtube.svg'

// Icons from: https://simpleicons.org/
export let SocialIconsMap = {
  Mail,
  Github,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
}

export function SocialIcon({ name, href, size = 8 }: SocialIconProps) {
  if (!href) return null

  let SocialSvg = SocialIconsMap[name]
  let attrs: AnchorHTMLAttributes<HTMLAnchorElement> = {
    href,
    rel: 'noopener noreferrer',
  }
  if (name !== 'Mail') {
    attrs.target = '_blank'
  }

  return (
    <a className="text-sm text-gray-500 transition hover:text-gray-600" {...attrs}>
      <span className="sr-only">{name}</span>
      <SocialSvg
        className={`fill-current text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 h-${size} w-${size}`}
      />
    </a>
  )
}
