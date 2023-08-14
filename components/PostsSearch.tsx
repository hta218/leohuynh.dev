import { Search } from 'lucide-react'
import { useTranslation } from 'next-i18next'

export function PostsSearch({ onChange }: { onChange: (value: string) => void }) {
  let { t } = useTranslation('common')

  return (
    <div className="relative max-w-lg">
      <input
        aria-label="Search posts"
        type="text"
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('blog.search_posts')}
        className="block w-full rounded-md border border-gray-300 bg-white pl-4 pr-10 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-100"
        data-umami-event="post-search"
      />
      <Search
        strokeWidth={1.5}
        size={20}
        className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
      />
    </div>
  )
}
