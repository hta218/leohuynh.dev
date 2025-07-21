import { Twemoji } from '~/components/ui/twemoji'
import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      { type: 'output', content: 'about me' },
      { type: 'output', content: '=================' },
      { type: 'output', content: 'background:' },
      {
        type: 'output',
        content:
          '• i learned pascal as my first programming language when i was in high school.',
      },
      {
        type: 'output',
        content:
          '• i wrote my first line of C/C++ code in 2016 and have been hooked ever since.',
      },
      {
        type: 'output',
        content: '• landed my first job as a python coding mentor in 2017.',
      },
      { type: 'output', content: 'passionate about:' },
      { type: 'output', content: '• javascript/typescript ecosystem' },
      { type: 'output', content: '• web development & modern frameworks' },
      { type: 'output', content: '• ecommerce & shopify development' },
      { type: 'output', content: '• building tools that help developers' },
      { type: 'output', content: 'facts:' },
      {
        type: 'component',
        component: () => {
          return (
            <ul className="list-disc pl-5">
              <li>i was born in the beautiful moc chau plateau.</li>
              <li>i'm tutulele's husband.</li>
              <li>
                i'm a sport-guy, i love
                <span className="ml-2">
                  <Twemoji emoji="soccer-ball" />,
                  <Twemoji emoji="man-swimming" />,
                  <Twemoji emoji="ping-pong" />,
                  <Twemoji emoji="volleyball" />
                </span>
              </li>
              <li>i love watching football games.</li>
              <li>
                i love playing <Twemoji emoji="musical-keyboard" /> &{' '}
                <Twemoji emoji="guitar" />
              </li>
              <li>i love rock music.</li>
              <li>
                i love playing chess <Twemoji emoji="chess-pawn" />
              </li>
              <li>
                i love playing video games, pes is my favorite one{' '}
                <Twemoji emoji="video-game" />.
              </li>
            </ul>
          )
        },
      },
      {
        type: 'output',
        content:
          'currently working on weaverse - the first hydrogen-driven website builder.',
      },
    ],
  }
}
