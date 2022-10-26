/* eslint-disable jsx-a11y/anchor-has-content */
import NextLink from 'next/link'
import type { AnchorHTMLAttributes } from 'react'

export function Link({ href, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  let isInternalLink = href && href.startsWith('/')
  let isAnchorLink = href && href.startsWith('#')

  if (isInternalLink) {
    return <NextLink href={href} {...rest} />
  }

  if (isAnchorLink) {
    return <a href={href} {...rest} />
  }

  return <a target="_blank" rel="noopener noreferrer" href={href} {...rest} />
}
