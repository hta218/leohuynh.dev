import { execute as executeAboutCommand } from './commands/about'
import { execute as executeActivitiesCommand } from './commands/activities'
import { execute as executeBlogsCommand } from './commands/blogs'
import { execute as executeClearCommand } from './commands/clear'
import { execute as executeHelpCommand } from './commands/help'
import { execute as executeHobbiesCommand } from './commands/hobbies'
import { execute as executeMusicCommand } from './commands/music'
import { execute as executeNavCommand } from './commands/nav'
import { execute as executeProjectsCommand } from './commands/projects'
import { execute as executePwdCommand } from './commands/pwd'
import { execute as executeQuotesCommand } from './commands/quotes'
import { execute as executeReadCommand } from './commands/read'
import { execute as executeSkillsCommand } from './commands/skills'
import { execute as executeSnippetsCommand } from './commands/snippets'
import { execute as executeTimeCommand } from './commands/time'
import { execute as executeWhoamiCommand } from './commands/whoami'
import type { Command } from './types'
import type { CommandResult } from './types'

export const COMMANDS: Command[] = [
  // Info commands
  {
    command: 'help',
    aliases: ['h', '?'],
    description: 'show all available commands',
    category: 'system',
  },
  {
    command: 'whoami',
    aliases: ['who', 'me'],
    description: 'display information about me',
    category: 'info',
  },
  {
    command: 'about',
    aliases: ['bio', 'info'],
    description: 'show detailed bio and background',
    category: 'info',
  },
  {
    command: 'skills',
    aliases: ['tech', 'stack'],
    description: 'list technical skills and expertise',
    category: 'info',
  },

  // Data commands
  {
    command: 'projects',
    aliases: ['work', 'portfolio', 'built'],
    description: 'show projects and work',
    category: 'data',
  },
  // {
  //   command: 'blogs',
  //   aliases: ['posts', 'articles', 'writing'],
  //   description: 'list blog posts and articles',
  //   category: 'data',
  // },
  // {
  //   command: 'snippets',
  //   aliases: ['snip', 'code'],
  //   description: 'show code snippets collection',
  //   category: 'data',
  // },
  {
    command: 'activities',
    aliases: ['activity', 'logs', 'recent'],
    description: 'show recent activities and updates',
    category: 'data',
  },

  // Fun commands
  {
    command: 'hobbies',
    aliases: ['interests', 'fun'],
    description: 'what i do for fun',
    category: 'fun',
  },
  {
    command: 'quotes',
    aliases: ['quote', 'wisdom'],
    description: 'favorite quotes and thoughts',
    category: 'fun',
  },
  {
    command: 'music',
    aliases: ['song', 'spotify'],
    description: 'current music taste',
    category: 'fun',
  },

  // System commands
  // {
  //   command: 'nav',
  //   aliases: ['navigate', 'links', 'pages'],
  //   description: 'show site navigation and available pages',
  //   category: 'system',
  // },
  {
    command: 'clear',
    aliases: ['cls', 'clean'],
    description: 'clear the terminal screen',
    category: 'system',
  },
  {
    command: 'pwd',
    aliases: ['location'],
    description: 'show current location',
    category: 'system',
  },
  {
    command: 'time',
    aliases: ['date', 'now'],
    description: 'show current time in my timezone',
    category: 'system',
  },
  // {
  //   command: 'read',
  //   aliases: ['open'],
  //   description: 'read a blog post (usage: read <number>)',
  //   category: 'system',
  // },
]

export const ASCII_ART = `
██╗     ███████╗ ██████╗ ██╗  ██╗██╗   ██╗██╗   ██╗███╗   ██╗██╗  ██╗    ██████╗ ███████╗██╗   ██╗
██║     ██╔════╝██╔═══██╗██║  ██║██║   ██║╚██╗ ██╔╝████╗  ██║██║  ██║    ██╔══██╗██╔════╝██║   ██║
██║     █████╗  ██║   ██║███████║██║   ██║ ╚████╔╝ ██╔██╗ ██║███████║    ██║  ██║█████╗  ██║   ██║
██║     ██╔══╝  ██║   ██║██╔══██║██║   ██║  ╚██╔╝  ██║╚██╗██║██╔══██║    ██║  ██║██╔══╝  ╚██╗ ██╔╝
███████╗███████╗╚██████╔╝██║  ██║╚██████╔╝   ██║   ██║ ╚████║██║  ██║ ██╗██████╔╝███████╗ ╚████╔╝ 
╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═╝╚═════╝ ╚══════╝  ╚═══╝  
`

export const WELCOME_TEXT = [
  'howdy, fellow! welcome to my personal cli on the web.',
  "type 'help' or '?' to see available commands or start typing for suggestions.",
  '---',
]

export async function executeCommand(command: string): Promise<CommandResult> {
  const cmd = command.toLowerCase().trim()

  // Find command by name or alias
  const foundCommand = COMMANDS.find(
    (c) => c.command === cmd || c.aliases?.includes(cmd),
  )

  switch (foundCommand?.command || cmd) {
    case 'help':
      return executeHelpCommand()

    case 'whoami':
      return executeWhoamiCommand()

    case 'about':
      return executeAboutCommand()

    case 'skills':
      return executeSkillsCommand()

    case 'projects':
      return executeProjectsCommand()

    case 'blogs':
      return executeBlogsCommand()

    case 'snippets':
      return executeSnippetsCommand()

    case 'activities':
      return executeActivitiesCommand()

    case 'hobbies':
      return executeHobbiesCommand()

    case 'quotes':
      return executeQuotesCommand()

    case 'music':
      return executeMusicCommand()

    case 'nav':
      return executeNavCommand()

    case 'clear':
      return executeClearCommand()

    case 'pwd':
      return executePwdCommand()

    case 'time':
      return executeTimeCommand()

    default:
      return {
        lines: [
          { type: 'error', content: `command not found: ${cmd}` },
          {
            type: 'info',
            content: "type 'help' or '?' to see available commands",
          },
        ],
      }
  }
}
