import type { Command } from './types'

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
    description: 'display information about leo',
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
  {
    command: 'blogs',
    aliases: ['posts', 'articles', 'writing'],
    description: 'list blog posts and articles',
    category: 'data',
  },
  {
    command: 'snippets',
    aliases: ['snip', 'code'],
    description: 'show code snippets collection',
    category: 'data',
  },
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
    command: 'date',
    aliases: ['time', 'now'],
    description: 'show current date and time',
    category: 'system',
  },
  {
    command: 'read',
    aliases: ['open'],
    description: 'read a blog post (usage: read <number>)',
    category: 'system',
  },
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
