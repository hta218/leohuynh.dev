import { MDXLayoutRenderer } from 'components/MDXComponents'
import { PageTitle } from '~/components'
import { formatSlug, getCommentConfigs, getFiles } from '~/libs'
import { getFileBySlug } from '~/libs/mdx'
import type { MdxPageLayout, SnippetProps } from '~/types'

let DEFAULT_LAYOUT: MdxPageLayout = 'PostSimple'

export async function getStaticPaths() {
  let snippets = getFiles('snippets')
  return {
    paths: snippets.map((p: string) => ({
      params: {
        slugs: formatSlug(p).split('/'),
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { slugs: string[] } }) {
  let snippet = await getFileBySlug('snippets', params.slugs.join('/'))
  let commentConfig = getCommentConfigs()
  return { props: { snippet, commentConfig } }
}

export default function Snippet({ snippet, commentConfig }: SnippetProps) {
  let { mdxSource, frontMatter } = snippet

  return (
    <>
      {frontMatter.draft !== true ? (
        <MDXLayoutRenderer
          layout={frontMatter.layout || DEFAULT_LAYOUT}
          mdxSource={mdxSource}
          type="snippets"
          frontMatter={frontMatter}
          commentConfig={commentConfig}
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
