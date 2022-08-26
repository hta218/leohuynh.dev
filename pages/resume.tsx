import { MDXLayoutRenderer } from '~/components'
import { getFileBySlug } from '~/libs/mdx'

export async function getStaticProps() {
  let resumeDetails = await getFileBySlug('authors', ['resume'])
  return { props: { resumeDetails } }
}

export default function About({ resumeDetails }) {
  let { mdxSource, frontMatter } = resumeDetails

  return (
    <MDXLayoutRenderer
      layout={frontMatter.layout}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
    />
  )
}
