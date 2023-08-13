import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, MoonStar } from 'lucide-react'

export function ThemeSwitcher() {
  let [mounted, setMounted] = useState(false)
  let { theme, setTheme, resolvedTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])
  let isDark = theme === 'dark' || resolvedTheme === 'dark'

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      data-umami-event="nav-theme-switcher"
    >
      {mounted && isDark ? (
        <MoonStar strokeWidth={1.5} size={20} />
      ) : (
        <Sun strokeWidth={1.5} size={20} />
      )}
    </button>
  )
}
