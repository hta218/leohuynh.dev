import { MDXLayoutRenderer } from 'components/MDXComponents'
import { getFileBySlug } from '~libs/mdx'

export async function getStaticProps() {
  const resumeDetails = await getFileBySlug('authors', ['resume'])
  return { props: { resumeDetails } }
}

export default function About({ resumeDetails }) {
  const { mdxSource, frontMatter } = resumeDetails

  return (
    <MDXLayoutRenderer
      layout={frontMatter.layout}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
    />
  )
}
