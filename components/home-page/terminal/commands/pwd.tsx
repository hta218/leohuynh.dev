import { Twemoji } from '~/components/ui/twemoji'
import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      {
        type: 'component',
        content: '/home/leo/leohuynh.dev',
        component: () => {
          return (
            <div className="flex items-center">
              <span>~/the-internet/</span>
              <Twemoji emoji="flag-vietnam" />
              <span className="-ml-0.5">/leohuynh.dev/home</span>
            </div>
          )
        },
      },
    ],
  }
}
