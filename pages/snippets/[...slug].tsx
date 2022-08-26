import { MDXLayoutRenderer } from 'components/MDXComponents'
import { PageTitle } from '~/components'
import { getFileBySlug } from '~/libs/mdx'
import { getFiles, formatSlug } from '~/libs'

let DEFAULT_LAYOUT = 'PostSimple'

export async function getStaticPaths() {
  let snippets = getFiles('snippets')
  return {
    paths: snippets.map((p: string) => ({
      params: {
        slug: formatSlug(p).split('/'),
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  let snippet = await getFileBySlug('snippets', params.slug.join('/'))
  return { props: { snippet } }
}

export default function Snippet({ snippet }) {
  let { mdxSource, frontMatter } = snippet

  return (
    <>
      {frontMatter.draft !== true ? (
        <MDXLayoutRenderer
          layout={frontMatter.layout || DEFAULT_LAYOUT}
          mdxSource={mdxSource}
          type="snippets"
          frontMatter={frontMatter}
        />
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under construction
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  )
}
