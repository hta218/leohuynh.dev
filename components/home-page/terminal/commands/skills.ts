import type { CommandResult } from '../types'

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      { type: 'output', content: 'technical skills' },
      { type: 'output', content: '===============' },
      { type: 'output', content: 'languages:' },
      {
        type: 'output',
        content: '  javascript, typescript, css, python, liquid',
      },
      { type: 'output', content: 'frontend:' },
      {
        type: 'output',
        content:
          '  react, next.js, remix (react router), tailwindcss, radix-ui, headlessui',
      },
      { type: 'output', content: 'backend:' },
      {
        type: 'output',
        content: '  node.js, prisma, drizzle, mongodb, supabase',
      },
      { type: 'output', content: 'ecommerce:' },
      { type: 'output', content: '  shopify, hydrogen, liquid, themekit' },
      { type: 'output', content: 'ai:' },
      {
        type: 'output',
        content: '  chat-gpt, claude-code, cursor, copilot, gemini',
      },
      { type: 'output', content: 'tools:' },
      {
        type: 'output',
        content: '  git, vscode, vercel, railway',
      },
    ],
  }
}
