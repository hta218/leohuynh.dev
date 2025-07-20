import Link from 'next/link'
import { Image } from '~/components/ui/image'
import { MusicWaves } from '~/components/ui/music-waves'
import { useNowPlaying } from '~/hooks/use-now-playing'
import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      { type: 'output', content: 'music taste' },
      { type: 'output', content: '===========' },
      {
        type: 'component',
        component: () => {
          let { isLoading, data } = useNowPlaying()
          if (isLoading) {
            return <div>loading...</div>
          }
          if (!data.isPlaying) {
            return <div>not listening to anything right now</div>
          }
          let { songUrl, title, artist, albumImageUrl } = data.song
          return (
            <div className="flex items-center truncate">
              <Image
                src={albumImageUrl}
                alt={title || 'Now playing'}
                width={40}
                height={40}
                className="h-5.5 w-5.5 shrink-0 animate-spin rounded-full border border-gray-300 [animation-duration:6s] dark:border-gray-700"
              />
              <div className="ml-2 inline-flex truncate lowercase">
                <MusicWaves className="mr-2" />
                <Link
                  href={songUrl}
                  className="hover:underline underline-offset-4"
                  title={`${title} - ${artist}`}
                >
                  <span data-umami-event="spotify-now-playing-view-song">
                    {title}
                  </span>
                </Link>
                <span className="mx-2 text-(--artist-color)">{' – '}</span>
                <p data-terminal-info className="max-w-max truncate">
                  {artist}
                </p>
              </div>
            </div>
          )
        },
      },
      { type: 'output', content: 'favorite artists:' },
      { type: 'output', content: '• coldplay, radiohead, the beatles' },
      { type: 'output', content: '• bon iver, the national, arcade fire' },
      { type: 'output', content: '• kings of convenience, zero 7' },
      { type: 'output', content: 'currently on repeat:' },
      { type: 'output', content: '🎵 "the scientist" by coldplay' },
      { type: 'output', content: '🎵 "holocene" by bon iver' },
    ],
  }
}
