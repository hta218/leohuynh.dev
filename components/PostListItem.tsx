import { useTranslation } from 'next-i18next'
import type { BlogFrontMatter, SnippetFrontMatter } from '~/types/mdx'
import { formatDate } from '~/utils/date'
import { Link } from './Link'
import { Tag } from './Tag'

export function PostListItem({
  frontMatter,
}: {
  frontMatter: BlogFrontMatter | SnippetFrontMatter
}) {
  let { slug, date, title, summary, tags, heading, type } = frontMatter as BlogFrontMatter &
    SnippetFrontMatter
  let { t, i18n } = useTranslation()
  let lang = i18n.language
  let isSnippets = heading && type
  let category = isSnippets ? 'snippets' : 'blog'

  return (
    <li key={slug}>
      <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
        <dl>
          <dt className="sr-only">{t('blog.published_on')}</dt>
          <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
            <time dateTime={date}>{formatDate(date, lang)}</time>
          </dd>
        </dl>
        <div className="space-y-3 xl:col-span-3">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold leading-8 tracking-tight">
              <Link href={`/${category}/${slug}`} className="text-gray-900 dark:text-gray-100">
                <span data-umami-event="blog-title">{title}</span>
              </Link>
            </h3>
            <div className="flex flex-wrap">
              {tags.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          </div>
          <div className="prose max-w-none text-gray-500 dark:text-gray-400">{summary}</div>
        </div>
      </article>
    </li>
  )
}
