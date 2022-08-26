import { PageSeo } from 'components/SEO'
import { siteMetadata } from '~/data'
import { SnippetsLayout } from '~/layouts'
import { getAllFilesFrontMatter } from '~/libs/mdx'

export async function getStaticProps() {
  let snippets = await getAllFilesFrontMatter('snippets')
  return { props: { snippets } }
}

export default function Snippet({ snippets }) {
  let description = 'Reuseable code snippets collected by me'
  return (
    <>
      <PageSeo title={`Snippets - ${siteMetadata.author}`} description={description} />
      <SnippetsLayout snippets={snippets} description={description} />
    </>
  )
}
