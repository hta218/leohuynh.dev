import { MDXLayoutRenderer } from '~/components/MDXComponents'
import { getFileBySlug } from '~/libs/mdx'
import type { MdxFileData } from '~/types'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export async function getStaticProps({ locale }) {
  let resumeData = await getFileBySlug('authors', 'resume', locale)
  return {
    props: { resumeData, ...(await serverSideTranslations(locale, ['common'])) },
  }
}

export default function About({ resumeData }: { resumeData: MdxFileData }) {
  let { mdxSource, frontMatter, toc } = resumeData

  return (
    <MDXLayoutRenderer
      layout={frontMatter.layout}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
      toc={toc}
    />
  )
}
