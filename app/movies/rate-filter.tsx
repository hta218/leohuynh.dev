'use client'

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { Fragment } from 'react'
import { Link } from '~/components/ui/link'
import { Twemoji } from '~/components/ui/twemoji'
import type { TitleType } from './title-type-filter'

export const RATES: {
  label: string
  description: string
  value: RateType
  emoji: string
}[] = [
  { label: '10', description: 'must watch', value: '10', emoji: 'hundred-points' },
  {
    label: '9',
    description: 'recommended',
    value: '9',
    emoji: 'sports-medal',
  },
  { label: '8', description: 'good', value: '8', emoji: 'popcorn' },
  { label: '7', description: 'okay / not bad', value: '7', emoji: 'thumbs-up' },
  {
    label: '6-',
    description: 'i don’t like',
    value: '<=6',
    emoji: 'man-gesturing-no',
  },
]

export type RateType = '10' | '9' | '8' | '7' | '<=6'

export function RateFilter({ rate, type }: { rate: RateType; type: TitleType }) {
  let { label, value: selectedValue } = RATES.find(({ value }) => value === rate) || RATES[0]
  return (
    <div className="flex items-center">
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton
          aria-label="More links"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 font-medium dark:border-gray-700"
          data-umami-event="movies-rate-filter"
        >
          <span>
            {label}/10 <span className="hidden md:inline">stars</span>
          </span>
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
              'absolute right-0 z-50',
              'mt-2 origin-top-right rounded-md text-right shadow-lg',
              'bg-white dark:bg-black',
              'ring-1 ring-black ring-opacity-5 focus:outline-none',
            ])}
          >
            <div className="space-y-1 p-1">
              {RATES.map(({ label, description, value, emoji }) => (
                <MenuItem key={value} as="div">
                  {({ close }) => (
                    <Link
                      className={clsx([
                        'flex w-full items-center gap-2 rounded-md px-2 py-1.5',
                        value === selectedValue
                          ? 'bg-gray-200 dark:bg-gray-800'
                          : 'hover:bg-gray-200 dark:hover:bg-gray-800',
                      ])}
                      href={`/movies?type=${type}&rate=${value}`}
                      onClick={close}
                    >
                      <span>({label})</span>
                      <span>{description}</span>
                      <Twemoji emoji={emoji} />
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
