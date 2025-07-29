import { Twemoji } from '~/components/ui/twemoji'
import {
  FOOTER_PERSONAL_STUFF,
  HEADER_NAV_LINKS,
  MORE_NAV_LINKS,
} from '~/data/navigation'
import type { CommandResult } from '../types'

function NavigationList() {
  return (
    <div className="space-y-4">
      {/* Main Navigation */}
      <div>
        <div className="font-medium mb-2" data-terminal-info>
          Main:
        </div>
        <div className="space-y-1">
          {HEADER_NAV_LINKS.map((link) => (
            <div key={link.href} className="flex items-center gap-2">
              <Twemoji emoji={link.emoji} size="base" />
              <span>
                <strong>{link.title.toLowerCase()}</strong> - {link.href}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Pages */}
      <div>
        <div className="font-medium mb-2" data-terminal-info>
          Additional Pages:
        </div>
        <div className="space-y-1">
          {MORE_NAV_LINKS.map((link) => (
            <div key={link.href} className="flex items-center gap-2">
              <Twemoji emoji={link.emoji} size="base" />
              <span>
                <strong>{link.title.toLowerCase()}</strong> - {link.href}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Stuff */}
      <div>
        <div className="font-medium mb-2" data-terminal-info>
          Personal:
        </div>
        <div className="space-y-1">
          {FOOTER_PERSONAL_STUFF.filter(
            (link) =>
              !HEADER_NAV_LINKS.some((h) => h.href === link.href) &&
              !MORE_NAV_LINKS.some((m) => m.href === link.href),
          ).map((link) => (
            <div key={link.href} className="flex items-center gap-2">
              <span>📄</span>
              <span>
                <strong>{link.title.toLowerCase()}</strong> - {link.href}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Home */}
      <div>
        <div className="text-sm font-medium mb-2" data-terminal-info>
          Home:
        </div>
        <div className="flex items-center gap-2">
          <Twemoji emoji="house" size="base" />
          <span>
            <strong>home</strong> - /
          </span>
        </div>
      </div>
    </div>
  )
}

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      { type: 'output', content: 'site navigation' },
      { type: 'output', content: '===============' },
      { type: 'output', content: '' },
      {
        type: 'component',
        component: () => <NavigationList />,
      },
      { type: 'output', content: '' },
      { type: 'info', content: 'navigation tips:' },
      {
        type: 'info',
        content:
          '• click on any link to navigate (cmd/ctrl + click for new tab)',
      },
      {
        type: 'info',
        content: '• use browser back/forward buttons to navigate between pages',
      },
      { type: 'info', content: '• bookmark pages you visit frequently' },
      {
        type: 'info',
        content: '• press "/" on any page to quickly search content',
      },
      {
        type: 'info',
        content: '• use the terminal on any page for consistent navigation',
      },
    ],
  }
}
