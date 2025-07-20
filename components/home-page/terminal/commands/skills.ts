import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      { type: 'output', content: 'technical skills' },
      { type: 'output', content: '===============' },
      { type: 'output', content: 'languages:' },
      {
        type: 'output',
        content: '  javascript, typescript, python, liquid',
      },
      { type: 'output', content: 'frontend:' },
      {
        type: 'output',
        content: '  react, next.js, remix, tailwindcss, headlessui',
      },
      { type: 'output', content: 'backend:' },
      { type: 'output', content: '  node.js, prisma, drizzle, supabase' },
      { type: 'output', content: 'ecommerce:' },
      { type: 'output', content: '  shopify, hydrogen, liquid, themekit' },
      { type: 'output', content: 'tools:' },
      {
        type: 'output',
        content: '  git, vscode, turborepo, vercel, railway',
      },
    ],
  }
}
