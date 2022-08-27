import { MDXLayoutRenderer } from 'components/MDXComponents'
import { PageTitle } from '~/components'
import { getFileBySlug } from '~/libs/mdx'
import { getFiles, formatSlug } from '~/libs'
import { commentConfig as DefaultCommentConfig } from '~/data'
import type { CommentConfigType } from '~/types'

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
	// This is a temporary workaround for the fact that the `mdx-bundler` & `esbuild`
	// is not working with the NextJS's public variables.
  let commentConfig: CommentConfigType = {
    ...DefaultCommentConfig,
    giscusConfig: {
      ...DefaultCommentConfig.giscusConfig,
      repo: process.env.GISCUS_REPO,
      repositoryId: process.env.GISCUS_REPOSITORY_ID,
      category: process.env.GISCUS_CATEGORY,
      categoryId: process.env.GISCUS_CATEGORY_ID,
    },
    utterancesConfig: {
      ...DefaultCommentConfig.utterancesConfig,
      repo: process.env.UTTERANCES_REPO,
    },
    disqus: {
      shortname: process.env.DISQUS_SHORTNAME,
    },
  }

  return { props: { snippet, commentConfig } }
}

export default function Snippet({ snippet, commentConfig }) {
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
