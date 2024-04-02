import { getMDXComponent } from 'mdx-bundler/client'
import { useMemo } from 'react'
import AuthorLayout from '~/layouts/AuthorLayout'
import PostLayout from '~/layouts/PostLayout'
import PostSimple from '~/layouts/PostSimple'
import ResumeLayout from '~/layouts/ResumeLayout'
import SnippetLayout from '~/layouts/SnippetLayout'
import type { MdxLayoutRendererProps } from '~/types/mdx'
import { Image } from './Image'
import { Link } from './Link'
import { Pre } from './Pre'

let Layouts = {
  PostLayout: PostLayout,
  PostSimple: PostSimple,
  SnippetLayout: SnippetLayout,
  AuthorLayout: AuthorLayout,
  ResumeLayout: ResumeLayout,
}

let MDXComponents = {
  Image,
  a: Link,
  pre: Pre,
  wrapper: ({ components, layout, ...rest }) => {
    let Layout = Layouts[layout]
    return <Layout {...rest} />
  },
}

export function MDXLayoutRenderer({ layout, mdxSource, ...rest }: MdxLayoutRendererProps) {
  let MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])
  return <MDXLayout layout={layout} components={MDXComponents} {...rest} />
}
