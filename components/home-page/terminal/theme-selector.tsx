import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import clsx from 'clsx'
import { Twemoji } from '~/components/ui/twemoji'

interface ThemeSelectorProps {
  currentTheme: string
  onChange: (theme: string) => void
}

const THEMES = [
  { name: 'solarized-light', label: 'Solarized Light' },
  { name: 'solarized-dark', label: 'Solarized Dark' },
  { name: 'github-light', label: 'GitHub Light' },
]

export function ThemeSelector({ currentTheme, onChange }: ThemeSelectorProps) {
  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center text-sm rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
        <Twemoji emoji="artist-palette" size="base" />
        {/* <span className="ml-1 text-gray-600">({currentTheme})</span> */}
      </MenuButton>

      <MenuItems className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
        {THEMES.map((theme) => {
          return (
            <MenuItem key={theme.name}>
              <button
                type="button"
                onClick={() => onChange(theme.name)}
                className={clsx(
                  'flex w-full items-center px-4 py-2 text-sm',
                  currentTheme === theme.name
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                )}
              >
                {theme.label}
              </button>
            </MenuItem>
          )
        })}
      </MenuItems>
    </Menu>
  )
}
