import { MDXLayoutRenderer } from '~/components'
import { getFileBySlug } from '~/libs/mdx'

export async function getStaticProps() {
  let authorDetails = await getFileBySlug('authors', ['default'])
  return { props: { authorDetails } }
}

export default function About({ authorDetails }) {
  let { mdxSource, frontMatter } = authorDetails

  return (
    <MDXLayoutRenderer
      layout={frontMatter.layout}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
    />
  )
}
