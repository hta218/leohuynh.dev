import { Search } from 'lucide-react'
import type { ChangeEventHandler } from 'react'

export function SearchArticles({
  onChange,
  label,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>
  label: string
}) {
  return (
    <div className="relative max-w-lg">
      <label>
        <span className="sr-only">{label}</span>
        <input
          aria-label={label}
          type="text"
          onChange={onChange}
          placeholder={label}
          className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
        />
      </label>
      <Search
        size={24}
        className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
      />
    </div>
  )
}
