import { getMDXComponent } from 'mdx-bundler/client'
import { useMemo } from 'react'
import { Image } from './Image'
import { Link } from './Link'
import { Pre } from './Pre'

let MDXComponents = {
  Image,
  a: Link,
  pre: Pre,
  wrapper: ({ components, layout, ...rest }) => {
    let Layout = require(`../layouts/${layout}`).default
    return <Layout {...rest} />
  },
}

export function MDXLayoutRenderer({ layout, mdxSource, ...rest }) {
  let MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])
  return <MDXLayout layout={layout} components={MDXComponents} {...rest} />
}
