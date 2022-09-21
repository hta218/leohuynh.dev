import { MDXLayoutRenderer } from '~/components'
import { getFileBySlug } from '~/libs/mdx'
import type { MdxFileData } from '~/types'

export async function getStaticProps() {
  const disclaimerData = await getFileBySlug('disclaimer', 'latest')
  return { props: { disclaimerData } }
}

export default function Disclaimer({ disclaimerData }: { disclaimerData: MdxFileData }) {
  let { mdxSource, frontMatter } = disclaimerData

  return (
    <MDXLayoutRenderer
      layout={frontMatter.layout}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
    />
  )
}
