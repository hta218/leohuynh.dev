import { usePathname } from 'next/navigation'
import { Twemoji } from '~/components/ui/twemoji'
import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      {
        type: 'component',
        component: () => {
          const pathname = usePathname()

          const getDisplayPath = () => {
            if (pathname === '/') return '/leohuynh.dev'
            return `/leohuynh.dev${pathname}`
          }
          return (
            <div className="flex items-center">
              <span>~/the-internet/</span>
              <Twemoji emoji="flag-vietnam" />
              <span className="-ml-0.5">{getDisplayPath()}</span>
            </div>
          )
        },
      },
    ],
  }
}
