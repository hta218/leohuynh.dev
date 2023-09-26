import { PageSeo } from 'components/SEO'
import fs from 'fs'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import path from 'path'
import { DEFAULT_LOCALE } from '~/constant'
import { ListLayout } from '~/layouts/ListLayout'
import { getMetaData } from '~/libs/files.server'
import { getAllFilesFrontMatter } from '~/libs/mdx.server'
import { generateRss } from '~/libs/rss.server'
import { getAllTags } from '~/libs/tags.server'
import type { BlogFrontMatter } from '~/types/mdx'
import { kebabCase } from '~/utils/string'

export async function getStaticPaths({ locales }: { locales: string[] }) {
  let tags = getAllTags(`${DEFAULT_LOCALE}/blog`, `${DEFAULT_LOCALE}/snippets`)
  let paths = []
  for (let locale of locales) {
    for (let tag of Object.keys(tags)) {
      paths.push({
        params: {
          tag,
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

// export function getStaticPaths() {
//   let tags = getAllTags('blog', 'snippets')
//   return {
//     paths: Object.keys(tags).map((tag) => ({
//       params: {
//         tag,
//       },
//     })),
//     fallback: false,
//   }
// }

export async function getStaticProps({
  params,
  locale,
}: {
  params: { tag: string }
  locale: string
}) {
  let allPosts = getAllFilesFrontMatter(`${locale}/blog`, `${locale}/snippets`)
  let filteredPosts = allPosts.filter(
    (post) => post.draft !== true && post.tags.map((t) => kebabCase(t)).includes(params.tag)
  )

  let root = process.cwd()
  let rss = generateRss(getMetaData(locale), filteredPosts, `tags/${params.tag}/feed.xml`)
  let rssPath = path.join(root, 'public', 'tags', params.tag)
  fs.mkdirSync(rssPath, { recursive: true })
  fs.writeFileSync(path.join(rssPath, 'feed.xml'), rss)

  return {
    props: {
      posts: filteredPosts,
      tag: params.tag,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default function Tag({ posts, tag }: { posts: BlogFrontMatter[]; tag: string }) {
  let { t } = useTranslation('common')

  if (!tag) {
    return <div>{t('tag.no_tags_found')}</div>
  }

  // Capitalize first letter and convert space to dash
  let title = tag[0] + tag.split(' ').join('-').slice(1)

  return (
    <>
      <PageSeo
        title={`${tag} - ${t('site_meta_data.title')}`}
        description={`${tag} tag - ${t('site_meta_data.title')}`}
      />
      <ListLayout posts={posts} title={`Tag: #${title}`} />
    </>
  )
}
