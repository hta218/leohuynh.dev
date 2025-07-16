import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import clsx from 'clsx'
import { Check } from 'lucide-react'
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
      <MenuButton
        className={clsx(
          'flex items-center rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-800 text-sm',
          'data-[open]:bg-gray-200 focus-visible:outline-0',
        )}
      >
        <Twemoji emoji="artist-palette" size="base" />
        {/* <span className="ml-1 text-gray-600">({currentTheme})</span> */}
      </MenuButton>

      <MenuItems className="absolute right-0 z-10 mt-2 w-52 border border-gray-200 rounded-md bg-white focus-visible:outline-0 py-1 shadow-lg dark:bg-gray-800">
        {THEMES.map((theme) => {
          return (
            <MenuItem key={theme.name}>
              <button
                type="button"
                onClick={() => onChange(theme.name)}
                className={clsx(
                  'flex w-full items-center justify-between px-4 py-2 text-sm',
                  'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                )}
              >
                <span>{theme.label}</span>
                {currentTheme === theme.name && (
                  <Check className="ml-2 h-4 w-4" />
                )}
              </button>
            </MenuItem>
          )
        })}
      </MenuItems>
    </Menu>
  )
}
