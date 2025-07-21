import Link from 'next/link'
import { Twemoji } from '~/components/ui/twemoji'
import { SITE_METADATA } from '~/data/site-metadata'
import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      {
        type: 'output',
        content: 'name: tuan anh huynh',
      },
      {
        type: 'output',
        content: 'alias: leo (at work)',
      },
      {
        type: 'output',
        content: 'pronouns: he/him',
      },
      {
        type: 'output',
        content:
          'roles: husband, father, software developer, learner, builder, and freedom-seeker',
      },
      {
        type: 'component',
        component: () => (
          <div className="flex items-center">
            location: [::1]:443 - ha noi,{' '}
            <Twemoji emoji="flag-vietnam" className="ml-1! mb-[3px]!" />
          </div>
        ),
      },
      { type: 'output', content: 'email: contact@leohuynh.dev' },
      {
        type: 'component',
        component: () => {
          return (
            <div className="space-y-1">
              <div>social accounts:</div>
              <ul className="ml-8 mt-1 list-disc">
                <li>
                  <Link
                    href={SITE_METADATA.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline underline-offset-4"
                  >
                    {SITE_METADATA.github}
                  </Link>
                </li>
                <li>
                  <Link
                    href={SITE_METADATA.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline underline-offset-4"
                  >
                    {SITE_METADATA.linkedin}
                  </Link>
                </li>
                <li>
                  <Link
                    href={SITE_METADATA.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline underline-offset-4"
                  >
                    {SITE_METADATA.x}
                  </Link>
                </li>
              </ul>
            </div>
          )
        },
      },
    ],
  }
}
