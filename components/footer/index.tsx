import { clsx } from 'clsx'
import { Container } from '~/components/ui/container'
import { Link } from '~/components/ui/link'
import { SpotifyNowPlaying } from '~/components/ui/now-playing'
import { SITE_METADATA } from '~/data/site-metadata'
import MadeInVietNam from '~/icons/miv.svg'
import { AddressAndTime } from './address-and-time'
import { FooterNav } from './footer-nav'
import { LogoAndRepo } from './logo-and-repo'
import { Signature } from './signature'

export function Footer() {
  return (
    <Container as="footer" className="my-8 md:mt-16">
      <div
        className={clsx([
          'grid grid-cols-1 gap-x-8 gap-y-8 py-8 md:grid-cols-2',
          'border-t border-gray-200 dark:border-gray-700',
        ])}
      >
        <div className="col-span-1 space-y-4">
          <LogoAndRepo />
          <div className="italic text-gray-500 dark:text-gray-400">{SITE_METADATA.description}</div>
          <div className="pt-4">
            <div className="flex gap-10 md:gap-20">
              <Signature className="h-20 w-36 md:w-40" />
              <AddressAndTime />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <FooterNav />
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 dark:border-gray-700 md:flex-row md:pt-4">
        <SpotifyNowPlaying
          className={clsx(['[--artist-color:theme(colors.gray.500)]'])}
          songEffect="underline"
        />
        <div className="my-2 flex flex-wrap items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <Link href={SITE_METADATA.siteRepo}>
            <span data-umami-event="made-in-vietnam">
              <MadeInVietNam />
            </span>
          </Link>
        </div>
      </div>
    </Container>
  )
}
