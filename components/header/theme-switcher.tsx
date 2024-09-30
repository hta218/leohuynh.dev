'use client'

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Radio,
  RadioGroup,
  Transition,
} from '@headlessui/react'
import { Monitor, MoonStar, Sun, SunMoon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Fragment, useEffect, useState } from 'react'

const THEMES = [
  {
    label: 'Light',
    value: 'light',
    icon: Sun,
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: MoonStar,
  },
  {
    label: 'System',
    value: 'system',
    icon: Monitor,
  },
]

export function ThemeSwitcher() {
  let [mounted, setMounted] = useState(false)
  let { theme, setTheme, resolvedTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  return (
    <div className="flex items-center">
      <Menu as="div" className="relative inline-block text-left">
        <div
          className="flex items-center justify-center rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700"
          data-umami-event="nav-theme-switcher"
        >
          <MenuButton aria-label="Theme switcher">
            {mounted ? (
              resolvedTheme === 'dark' ? (
                <MoonStar strokeWidth={1.5} size={22} />
              ) : (
                <Sun strokeWidth={1.5} size={22} />
              )
            ) : (
              <SunMoon strokeWidth={1.5} size={22} />
            )}
          </MenuButton>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 z-50 mt-2 w-32 origin-top-right translate-x-[calc(50%-17px)] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black">
            <RadioGroup value={theme} onChange={setTheme}>
              <div className="space-y-1 p-1">
                {THEMES.map(({ label, value, icon: Icon }) => (
                  <Radio
                    key={value}
                    value={value}
                    as="div"
                    className="cursor-pointer rounded-md hover:bg-gray-200 data-[checked]:bg-gray-200 dark:hover:bg-gray-800 dark:data-[checked]:bg-gray-800"
                  >
                    <MenuItem
                      as="div"
                      className="flex w-full items-center gap-3 px-2 py-1.5 text-sm"
                    >
                      <Icon size={20} strokeWidth={1.5} />
                      <span>{label}</span>
                    </MenuItem>
                  </Radio>
                ))}
              </div>
            </RadioGroup>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  )
}
