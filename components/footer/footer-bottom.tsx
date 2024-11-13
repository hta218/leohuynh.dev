import { clsx } from 'clsx'
import { AreaChart, Rss } from 'lucide-react'
import { Link } from '~/components/ui/link'
import { SpotifyNowPlaying } from '~/components/ui/now-playing'
import { SITE_METADATA } from '~/data/site-metadata'
import MadeInVietNam from '~/icons/miv.svg'

export function FooterBottom() {
  return (
    <div
      className={clsx([
        'pt-5 md:my-2',
        'flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between md:gap-16',
        'border-t border-gray-200 dark:border-gray-700',
      ])}
    >
      <SpotifyNowPlaying
        className="w-full justify-center truncate [--artist-color:theme(colors.gray.500)] md:max-w-[50%] md:justify-start"
        songEffect="underline"
        showCover
      />
      <div className="flex items-center">
        <Link href={SITE_METADATA.siteRepo}>
          <span data-umami-event="made-in-vietnam">
            <MadeInVietNam />
          </span>
        </Link>
        {/* <span className="mx-2.5 text-gray-400">|</span>
        <Link href="/feed.xml" aria-label="RSS Feed" data-umami-event="rss-feed" prefetch={false}>
          <Rss strokeWidth={1.5} size={20} />
        </Link>
        <Link
          href={SITE_METADATA.analytics.umamiAnalytics.shareUrl}
          aria-label="Open analytics"
          data-umami-event="footer-analytics"
          className="ml-2"
        >
          <AreaChart strokeWidth={1.5} size={22} />
        </Link> */}
      </div>
    </div>
  )
}
