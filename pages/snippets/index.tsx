import { PageSeo } from 'components/SEO'
import { siteMetadata } from '~/data'
import { SnippetLayout } from '~/layouts'
import { getAllFilesFrontMatter } from '~/libs/mdx'
import type { SnippetFrontMatter } from '~/types'

export async function getStaticProps() {
  let snippets = getAllFilesFrontMatter('snippets')
  return { props: { snippets } }
}

export default function Snippet({ snippets }: { snippets: SnippetFrontMatter[] }) {
  let description = 'Reuseable code snippets collected by me'
  return (
    <>
      <PageSeo title={`Snippets - ${siteMetadata.author}`} description={description} />
      <SnippetLayout snippets={snippets} description={description} />
    </>
  )
}
