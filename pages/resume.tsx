import { MDXLayoutRenderer } from '~/components'
import { getFileBySlug } from '~/libs/mdx'
import type { MdxFileData } from '~/types'

export async function getStaticProps() {
  let resumeData = await getFileBySlug('authors', 'resume')
  return { props: { resumeData } }
}

export default function About({ resumeData }: { resumeData: MdxFileData }) {
  let { mdxSource, frontMatter } = resumeData

  return (
    <MDXLayoutRenderer
      layout={frontMatter.layout}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
    />
  )
}
