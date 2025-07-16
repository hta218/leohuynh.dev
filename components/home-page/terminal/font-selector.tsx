import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import clsx from 'clsx'
import { Check } from 'lucide-react'
import { Twemoji } from '~/components/ui/twemoji'
import type { ThemeClasses } from './types'

interface FontSelectorProps {
  currentFont: string
  onChange: (font: string) => void
  theme: ThemeClasses
}

const fonts = [
  { name: 'mono', label: 'Mono', class: 'font-mono' },
  { name: 'jetbrains', label: 'JetBrains Mono', class: 'font-jetbrains' },
  { name: 'fira', label: 'Fira Code', class: 'font-fira' },
  { name: 'source', label: 'Source Code Pro', class: 'font-source' },
]

export function FontSelector({
  currentFont,
  onChange,
  theme,
}: FontSelectorProps) {
  return (
    <Menu as="div" className="relative">
      <MenuButton
        className={clsx(
          'flex items-center rounded p-1 focus-visible:outline-0 hover:bg-gray-200 dark:hover:bg-gray-800 text-sm',
          'data-[open]:bg-gray-200',
        )}
      >
        <Twemoji emoji="keyboard" size="base" />
        {/* <span className="ml-1 text-gray-600">({currentFont})</span> */}
      </MenuButton>

      <MenuItems className="absolute right-0 z-10 mt-2 w-52 rounded-md bg-white py-1 shadow-lg focus-visible:outline-0 border border-gray-200 dark:bg-gray-800">
        {fonts.map((font) => (
          <MenuItem key={font.name}>
            <button
              type="button"
              onClick={() => onChange(font.name)}
              className={clsx(
                'flex w-full items-center justify-between px-4 py-2 text-sm',
                'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                font.class,
              )}
            >
              <span>{font.label}</span>
              {currentFont === font.name && <Check className="ml-2 h-4 w-4" />}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}
