import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Type } from 'lucide-react'
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
      <MenuButton className="flex items-center rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
        <Type size={16} />
      </MenuButton>

      <MenuItems className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800">
        {fonts.map((font) => (
          <MenuItem key={font.name}>
            <button
              type="button"
              onClick={() => onChange(font.name)}
              className={`flex w-full items-center px-4 py-2 text-sm ${font.class} ${
                currentFont === font.name
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {font.label}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}
