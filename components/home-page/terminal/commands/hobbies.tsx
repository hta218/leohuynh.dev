import { Twemoji } from '~/components/ui/twemoji'
import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      {
        type: 'output',
        content:
          "when i'm not coding, i usually spend time with my wife and my son, beside:",
      },
      { type: 'output', content: '===================' },
      {
        type: 'component',
        component: () => {
          return (
            <ul className="list-disc pl-5">
              <li>
                i play sports
                <span className="ml-2">
                  <Twemoji emoji="soccer-ball" />,
                  <Twemoji emoji="man-swimming" />,
                  <Twemoji emoji="ping-pong" />,
                  <Twemoji emoji="volleyball" />
                </span>
              </li>
              <li>i watch sports games (mostly football and volleyball).</li>
              <li>
                i play <Twemoji emoji="musical-keyboard" />,{' '}
                <Twemoji emoji="guitar" /> or <Twemoji emoji="chess-pawn" />{' '}
                (sometimes)
              </li>
              <li>
                i play video games with my friends{' '}
                <Twemoji emoji="video-game" />, (pes is my all-time favorite)
              </li>
            </ul>
          )
        },
      },
    ],
  }
}
