'use client'

import { ExternalLink, Music } from 'lucide-react'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { MusicWaves } from '~/components/ui/music-waves'
import { useNowPlaying } from '~/hooks/use-now-playing'
import type { RecentlyPlayedData } from '~/types/data'
import { getTimeAgo } from '~/utils/misc'

export function LastPlayed({
  recentlyPlayed,
}: {
  recentlyPlayed: RecentlyPlayedData
}) {
  let { data: nowPlayingData } = useNowPlaying()

  // If there's a song currently playing, show that instead
  if (nowPlayingData.isPlaying && nowPlayingData.song) {
    let { song } = nowPlayingData

    return (
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <Image
            alt={song.title}
            loading="lazy"
            width="400"
            height="400"
            className="h-auto w-16 md:w-20 rounded-full [animation-duration:8s] animate-spin object-cover border border-gray-300 dark:border-gray-700"
            src={song.albumImageUrl}
          />
          <div className="absolute -right-1 -bottom-1 flex items-center justify-center rounded-full bg-white p-1.5 shadow-md">
            <Music className="h-4 w-4 text-green-600" />
          </div>
        </div>
        <div className="flex grow items-center justify-between gap-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-1 font-medium flex gap-2">
                <MusicWaves className="" />
                <Link href={song.songUrl} className="font-semibold">
                  <GrowingUnderline>{song.title}</GrowingUnderline>
                </Link>
              </div>
              <p className="line-clamp-1 text-sm text-[#71717a] italic dark:text-gray-400">
                {song.artist}
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <span className="ml-4 flex-shrink-0 rounded-full bg-green-100 px-2.5 py-0.5 text-sm text-green-700 dark:bg-green-900 dark:text-green-300">
              Playing
            </span>
            <Link
              href="https://open.spotify.com/user/31uxi2mgkrjhj4agxmudr5cmfj7a"
              className="rounded p-2 text-gray-700 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Fall back to recently played if no song is currently playing
  if (!recentlyPlayed.ok) return null

  let { song } = recentlyPlayed

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        <Image
          alt={song.title}
          loading="lazy"
          width="400"
          height="400"
          className="h-auto w-16 md:w-20 rounded-lg object-cover"
          src={song.albumImageUrl}
        />
        <div className="absolute -right-1 -bottom-1 flex items-center justify-center rounded-full bg-white p-1.5 shadow-md">
          <Music className="h-4 w-4 text-green-600" />
        </div>
      </div>
      <div className="flex grow items-center justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="mb-1 font-medium">
              <span className="font-medium text-[#71717a] dark:text-gray-400">
                Last played:
              </span>{' '}
              <Link href={song.songUrl} className="font-semibold">
                <GrowingUnderline>{song.title}</GrowingUnderline>
              </Link>
            </p>
            <p className="line-clamp-1 text-sm text-[#71717a] italic dark:text-gray-400">
              {song.artist}
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span className="ml-4 flex-shrink-0 rounded-full bg-neutral-200 px-2.5 py-0.5 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            {getTimeAgo(song.playedAt)}
          </span>
          <Link
            href="https://open.spotify.com/user/31uxi2mgkrjhj4agxmudr5cmfj7a"
            className="rounded p-2 text-gray-700 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
