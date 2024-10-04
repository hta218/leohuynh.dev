'use client'

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { Fragment } from 'react'
import { Twemoji } from '~/components/ui/twemoji'

export const TITLE_TYPES: {
  label: string
  value: TitleType
  emoji: string
}[] = [
  {
    label: 'All',
    value: 'All',
    emoji: 'popcorn',
  },
  {
    label: 'Movie',
    value: 'Movie',
    emoji: 'movie-camera',
  },
  {
    label: 'TV Series',
    value: 'TV Series',
    emoji: 'television',
  },
]

export type TitleType = 'Movie' | 'TV Series' | 'All'

export function TitleTypeFilter({
  type,
  setType,
}: {
  type: TitleType
  setType: React.Dispatch<React.SetStateAction<TitleType>>
}) {
  let { label, value: selectedValue } =
    TITLE_TYPES.find(({ value }) => value === type) || TITLE_TYPES[0]
  return (
    <div className="flex items-center">
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton
          aria-label="More links"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 font-medium dark:border-gray-700"
          data-umami-event="movies-rate-filter"
        >
          <span>{label}</span>
          <ChevronDown strokeWidth={1.5} size={20} />
        </MenuButton>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems
            className={clsx([
              'absolute left-0 z-50 md:left-auto md:right-0',
              'mt-2 w-36 origin-top-right rounded-md text-right shadow-lg',
              'bg-white dark:bg-black',
              'ring-1 ring-black ring-opacity-5 focus:outline-none',
            ])}
          >
            <div className="space-y-1 p-1">
              {TITLE_TYPES.map(({ label, value, emoji }) => (
                <MenuItem key={value} as="div">
                  {({ close }) => (
                    <button
                      className={clsx([
                        'flex w-full items-center gap-2 rounded-md px-2 py-1.5',
                        value === selectedValue
                          ? 'bg-gray-200 dark:bg-gray-800'
                          : 'hover:bg-gray-200 dark:hover:bg-gray-800',
                      ])}
                      onClick={() => {
                        setType(value)
                        close()
                      }}
                    >
                      <Twemoji emoji={emoji} />
                      <span>{label}</span>
                    </button>
                  )}
                </MenuItem>
              ))}
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  )
}
