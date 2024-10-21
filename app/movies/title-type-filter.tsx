'use client'

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { Fragment } from 'react'
import { Link } from '~/components/ui/link'
import { Twemoji } from '~/components/ui/twemoji'
import type { RateType } from './rate-filter'

export const TITLE_TYPES: {
  label: string
  value: TitleType
  emoji: string
}[] = [
  {
    label: 'All',
    value: 'all',
    emoji: 'popcorn',
  },
  {
    label: 'Movie',
    value: 'movie',
    emoji: 'movie-camera',
  },
  {
    label: 'TV Series',
    value: 'tv-series',
    emoji: 'television',
  },
]

export type TitleType = 'movie' | 'tv-series' | 'all'

export function TitleTypeFilter({ type, rate }: { type: TitleType; rate: RateType }) {
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
                    <Link
                      className={clsx([
                        'flex w-full items-center gap-2 rounded-md px-2 py-1.5',
                        value === selectedValue
                          ? 'bg-gray-200 dark:bg-gray-800'
                          : 'hover:bg-gray-200 dark:hover:bg-gray-800',
                      ])}
                      href={`/movies?type=${value}&rate=${rate}`}
                      onClick={close}
                    >
                      <Twemoji emoji={emoji} />
                      <span>{label}</span>
                    </Link>
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
