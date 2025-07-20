import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      {
        type: 'output',
        content: 'Tuan Anh Huynh (aliased as Leo at work)',
      },
      { type: 'output', content: 'learner, builder, and freedom-seeker' },
      {
        type: 'output',
        content: 'location: [::1]:443 - ha noi, vietnam 🇻🇳',
      },
      { type: 'output', content: 'email: contact@leohuynh.dev' },
      { type: 'output', content: 'github: @hta218' },
      { type: 'output', content: 'twitter: @hta218_' },
      { type: 'output', content: 'twitter: @hta218_' },
      {
        type: 'component',
        component: () => {
          return (
            <a
              href="https://twitter.com/hta218_"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              test @hta218_
            </a>
          )
        },
      },
    ],
  }
}
