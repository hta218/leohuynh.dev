'use client'

import { clsx } from 'clsx'
import { Brand } from '~/components/ui/brand'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import { MusicWaves } from '~/components/ui/music-waves'
import { useNowPlaying } from '~/hooks/use-now-playing'
import { Image } from './image'

export function SpotifyNowPlaying({
  className,
  showCover,
  songEffect = 'none',
}: {
  className?: string
  showCover?: boolean
  songEffect?: 'none' | 'underline'
}) {
  let data = useNowPlaying()

  if (!data.isPlaying) {
    return (
      <div className={clsx('flex items-center', className)}>
        <Brand as="icon" name="Spotify" className="h-5.5 w-5.5 shrink-0" />
        <div className="ml-2 inline-flex truncate">
          <p className="font-medium text-(--song-color)">Not Playing</p>
          <span className="mx-2 text-(--artist-color)">{' – '}</span>
          <p className="spotify-artist max-w-max truncate text-(--artist-color)">
            Spotify
          </p>
        </div>
      </div>
    )
  }

  let { songUrl, title, artist, albumImageUrl } = data.song

  return (
    <div className={clsx('flex items-center', className)}>
      {showCover ? (
        <Image
          src={albumImageUrl}
          alt={title || 'Now playing'}
          width={40}
          height={40}
          className="h-5.5 w-5.5 shrink-0 animate-spin rounded-full border border-gray-300 [animation-duration:6s] dark:border-gray-700"
        />
      ) : (
        <Brand as="icon" name="Spotify" className="h-5.5 w-5.5 shrink-0" />
      )}
      <div className="ml-2 inline-flex truncate">
        <MusicWaves className="mr-2" />
        <Link
          href={songUrl}
          className="font-medium text-(--song-color)"
          title={`${title} - ${artist}`}
        >
          {songEffect === 'underline' ? (
            <GrowingUnderline data-umami-event="spotify-now-playing-view-song">
              {title}
            </GrowingUnderline>
          ) : (
            <span data-umami-event="spotify-now-playing-view-song">
              {title}
            </span>
          )}
        </Link>
        <span className="mx-2 text-(--artist-color)">{' – '}</span>
        <p className="spotify-artist max-w-max truncate text-(--artist-color)">
          {artist}
        </p>
      </div>
    </div>
  )
}
