import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import clsx from 'clsx'
import { Check } from 'lucide-react'
import { Twemoji } from '~/components/ui/twemoji'
import type { Theme } from './types'

interface ThemeSelectorProps {
  currentTheme: Theme
  onChange: (theme: Theme) => void
}

export const THEMES: Array<Theme> = [
  {
    name: 'solarized-light',
    label: 'Solarized Light',
    variables: {
      bg: 'var(--color-orange-50)',
      text: 'var(--color-gray-800)',
      prompt: 'var(--color-green-600)',
      command: 'var(--color-blue-600)',
      info: 'var(--color-gray-600)',
      error: 'var(--color-red-600)',
      accent: 'var(--color-purple-600)',
    },
  },
  {
    name: 'solarized-dark',
    label: 'Solarized Dark',
    variables: {
      bg: 'var(--color-slate-900)',
      text: 'var(--color-orange-100)',
      prompt: 'var(--color-green-400)',
      command: 'var(--color-blue-400)',
      info: 'var(--color-gray-400)',
      error: 'var(--color-red-400)',
      accent: 'var(--color-purple-400)',
    },
  },
  {
    name: 'dracula',
    label: 'Dracula',
    variables: {
      bg: '#282a36',
      text: '#f8f8f2',
      prompt: '#50fa7b',
      command: '#8be9fd',
      info: '#f1fa8c',
      error: '#ff5555',
      accent: '#bd93f9',
    },
  },
  {
    name: 'github-dark',
    label: 'GitHub Dark',
    variables: {
      bg: '#0d1117',
      text: '#c9d1d9',
      prompt: '#58a6ff',
      command: '#79c0ff',
      info: '#8b949e',
      error: '#f47067',
      accent: '#b392f0',
    },
  },
  {
    name: 'github-light',
    label: 'GitHub Light',
    variables: {
      bg: '#fff',
      text: 'var(--color-gray-900)',
      prompt: 'var(--color-green-500)',
      command: 'var(--color-blue-500)',
      info: 'var(--color-gray-600)',
      error: 'var(--color-red-500)',
      accent: 'var(--color-purple-500)',
    },
  },
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
                onClick={() => onChange(theme)}
                className={clsx(
                  'flex w-full items-center justify-between px-4 py-2 text-sm',
                  'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                )}
              >
                <span>{theme.label}</span>
                {currentTheme.name === theme.name && (
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
