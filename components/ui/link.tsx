import type { LinkProps } from 'next/link'
import NextLink from 'next/link'
import type { AnchorHTMLAttributes } from 'react'

export function Link({ href, ...rest }: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  let isInternalLink = href && href.startsWith('/')
  let isAnchorLink = href && href.startsWith('#')

  if (isInternalLink) {
    return <NextLink className="break-words" href={href} {...rest} />
  }

  if (isAnchorLink) {
    return <a className="break-words" href={href} {...rest} />
  }

  return (
    <a className="break-words" target="_blank" rel="noopener noreferrer" href={href} {...rest} />
  )
}
