import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Monitor, MoonStar, Sun } from 'lucide-react'
import type { ThemeClasses } from './types'

interface ThemeSelectorProps {
  currentTheme: string
  onChange: (theme: string) => void
}

const themes = [
  { name: 'solarized-light', label: 'Solarized Light', icon: Sun },
  { name: 'solarized-dark', label: 'Solarized Dark', icon: MoonStar },
  { name: 'github-light', label: 'GitHub Light', icon: Monitor },
]

export function ThemeSelector({ currentTheme, onChange }: ThemeSelectorProps) {
  const currentThemeData =
    themes.find((t) => t.name === currentTheme) || themes[0]
  const Icon = currentThemeData.icon

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
        <Icon size={16} />
      </MenuButton>

      <MenuItems className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
        {themes.map((theme) => {
          const ThemeIcon = theme.icon
          return (
            <MenuItem key={theme.name}>
              <button
                type="button"
                onClick={() => onChange(theme.name)}
                className={`flex w-full items-center px-4 py-2 text-sm ${
                  currentTheme === theme.name
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <ThemeIcon size={16} className="mr-3" />
                {theme.label}
              </button>
            </MenuItem>
          )
        })}
      </MenuItems>
    </Menu>
  )
}
