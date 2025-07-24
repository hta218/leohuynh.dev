import Link from 'next/link'
import { Image } from '~/components/ui/image'
import { MusicWaves } from '~/components/ui/music-waves'
import { Twemoji } from '~/components/ui/twemoji'
import { useNowPlaying } from '~/hooks/use-now-playing'
import type { SpotifySong } from '~/types/data'
import type { CommandResult } from '../types'

export function NowPlaying({ song }: { song: SpotifySong }) {
  let { songUrl, title, artist, albumImageUrl } = song
  return (
    <div className="flex items-center truncate">
      <div className="ml-0.5 inline-flex gap-2 truncate lowercase">
        <MusicWaves />
        <span>now playing:</span>
        <Image
          src={albumImageUrl}
          alt={title || 'Now playing'}
          width={40}
          height={40}
          className="h-5.5 w-5.5 shrink-0 rounded-full [animation-duration:6s]"
        />
        <Link
          href={songUrl}
          className="hover:underline underline-offset-4"
          title={`${title} - ${artist}`}
        >
          <strong>
            <span data-umami-event="spotify-now-playing-view-song">
              {title}
            </span>
          </strong>
        </Link>
        <span>by</span>
        <p data-terminal-info className="max-w-max truncate">
          {artist}
        </p>
      </div>
    </div>
  )
}

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
          return <NowPlaying song={data.song} />
        },
      },
      { type: 'output', content: 'favorite artists:' },
      { type: 'output', content: '• coldplay, oasis, taylor swift' },
      { type: 'output', content: '• ed sheeran, charlie puth, one d,' },
      {
        type: 'output',
        content: '• den vau, ung hoang phuc, truc nhan (vpop)',
      },
      { type: 'output', content: 'genres:' },
      { type: 'output', content: '• rock, pop, rap' },
      { type: 'output', content: 'top tracks:' },
      {
        type: 'component',
        component: () => {
          return (
            <>
              <div className="flex items-center gap-2">
                <Twemoji emoji="musical-note" size="base" />
                don't look back in anger by{' '}
                <span data-terminal-info>oasis</span>
              </div>
              <div className="flex items-center gap-2">
                <Twemoji emoji="musical-note" size="base" />
                let it be by <span data-terminal-info>the beatles</span>
              </div>
              <div className="flex items-center gap-2">
                <Twemoji emoji="musical-note" size="base" />
                hotel california by <span data-terminal-info>eagles</span>
              </div>
              <div className="flex items-center gap-2">
                <Twemoji emoji="musical-note" size="base" />
                never gonna give you up by{' '}
                <span data-terminal-info>rick astley</span>
              </div>
              <div className="flex items-center gap-2">
                <Twemoji emoji="musical-note" size="base" />
                viva la vida by <span data-terminal-info>coldplay</span>
              </div>
            </>
          )
        },
      },
    ],
  }
}
