'use client'

import { clsx } from 'clsx'
import { usePathname } from 'next/navigation'
import { Link } from '~/components/ui/link'
import { SpotifyNowPlaying } from '~/components/ui/now-playing'
import { SITE_METADATA } from '~/data/site-metadata'
import MadeInVietNam from '~/icons/miv.svg'
import { BuiltWith } from './built-with'

export function FooterBottom() {
  let pathname = usePathname()
  let isHomePage = pathname === '/'

  return (
    <div
      className={clsx([
        'pt-5 md:my-2',
        'flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between md:gap-16',
        'border-t border-gray-200 dark:border-gray-700',
      ])}
    >
      {isHomePage ? (
        <BuiltWith />
      ) : (
        <SpotifyNowPlaying
          className="w-full justify-center truncate [--artist-color:var(--color-gray-500)] md:max-w-[50%] md:justify-start"
          songEffect="underline"
          showCover
        />
      )}
      <Link href={SITE_METADATA.siteRepo}>
        <span data-umami-event="made-in-vietnam">
          <MadeInVietNam />
        </span>
      </Link>
    </div>
  )
}
