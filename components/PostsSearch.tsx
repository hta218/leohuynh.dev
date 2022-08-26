export function PostsSearch({ onChange }: { onChange: (value: string) => void }) {
  return (
    <div className="relative max-w-lg">
      <input
        aria-label="Search posts"
        type="text"
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search posts"
        className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-500 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-gray-100"
      />
      <svg
        className="absolute w-5 h-5 text-gray-400 right-3 top-3 dark:text-gray-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  )
}
