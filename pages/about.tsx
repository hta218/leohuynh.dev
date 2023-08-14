import { MDXLayoutRenderer } from '~/components/MDXComponents'
import { getFileBySlug } from '~/libs/mdx'
import type { MdxFileData } from '~/types/mdx'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export async function getStaticProps({ locale }: { params: { slug: string[] }; locale: string }) {
  let authorData = await getFileBySlug('authors', 'default', locale)
  return {
    props: { authorData, ...(await serverSideTranslations(locale, ['common'])) },
  }
}

export default function About({ authorData }: { authorData: MdxFileData }) {
  let { mdxSource, frontMatter } = authorData

  return (
    <MDXLayoutRenderer
      layout={frontMatter.layout}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
    />
  )
}
