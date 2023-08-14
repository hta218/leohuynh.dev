import { MDXLayoutRenderer } from 'components/MDXComponents'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PageTitle } from '~/components/PageTitle'
import { getCommentConfigs } from '~/libs/comment.server'
import { formatSlug, getFiles } from '~/libs/files.server'
import { getFileBySlug } from '~/libs/mdx.server'
import type { MdxPageLayout } from '~/types/mdx'
import type { SnippetProps } from '~/types/page'

let DEFAULT_LAYOUT: MdxPageLayout = 'PostSimple'

export async function getStaticPaths({ locales }: { locales: string[] }) {
  let paths = []
  for (let locale of locales) {
    let snippets = getFiles(`${locale}/snippets`)
    for (let snippet of snippets) {
      paths.push({
        params: {
          slug: formatSlug(snippet).split('/'),
        },
        locale: locale,
      })
    }
  }

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params, locale }) {
  let snippet = await getFileBySlug(locale, 'snippets', params.slug.join('/'))
  let commentConfig = getCommentConfigs()
  return {
    props: { snippet, commentConfig, ...(await serverSideTranslations(locale, ['common'])) },
  }
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
