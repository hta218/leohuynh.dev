/* eslint-disable react/display-name */
import { useMemo } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import Image from './Image'
import CustomLink from './Link'
import Pre from './Pre'

let MDXComponents = {
  Image,
  a: CustomLink,
  pre: Pre,
  wrapper: ({ components, layout, ...rest }) => {
    const Layout = require(`../layouts/${layout}`).default
    return <Layout {...rest} />
  },
}

export function MDXLayoutRenderer({ layout, mdxSource, ...rest }) {
  let MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource], [])

  return <MDXLayout layout={layout} components={MDXComponents} {...rest} />
}
