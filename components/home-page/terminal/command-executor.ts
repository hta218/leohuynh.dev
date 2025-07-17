import { PROJECTS } from '~/data/projects'
import { COMMANDS } from './commands'
import type { CommandResult } from './types'

// Mock blog data for demonstration
const MOCK_BLOGS = [
  {
    id: 'blurry-loading-shopify',
    title:
      'building a smooth blurry loading effect for images in shopify hydrogen',
    date: '2025-01-09',
    views: 1200,
    content: `Ever noticed how some websites show a blurry version of an image that gradually becomes clear as it loads? That's what we built!

This smooth loading effect makes your Shopify Hydrogen store feel faster and more polished. Instead of showing empty spaces or ugly placeholders, users see a preview that transforms into the final image.

## The Magic Behind the Blur

The core concept is simple:
1. Start with a heavily blurred image
2. Load the actual image in the background  
3. When loaded, transition from blur to sharp

Here's the key component structure:

\`\`\`typescript
export const Image = forwardRef<HTMLDivElement, ImageProps>(
  ({ className, onLoad, ...rest }, ref) => {
    const [loaded, setLoaded] = useState(false);
    
    return (
      <div className="overflow-hidden">
        <HydrogenImage
          className={loaded ? "blur-0" : "blur-xl"}
          onLoad={() => setLoaded(true)}
          {...rest}
        />
      </div>
    );
  }
);
\`\`\`

The transition happens automatically when the image loads, creating that smooth blur-to-sharp effect that users love!`,
    tags: ['shopify', 'hydrogen', 'react', 'image-optimization'],
  },
  {
    id: 'nextjs-blurry-images',
    title: 'how to create an image with blurry loading effect in next.js',
    date: '2024-12-15',
    views: 2800,
    content: `Next.js makes it incredibly easy to create smooth image loading experiences with built-in optimization.

## Why Blur Effects Matter

Loading states are crucial for user experience. Instead of showing empty spaces while images load, we can show a low-quality preview that gradually becomes sharp.

## Implementation

\`\`\`jsx
import Image from 'next/image'

function BlurImage({ src, alt, ...props }) {
  return (
    <Image
      src={src}
      alt={alt}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      {...props}
    />
  )
}
\`\`\`

Next.js handles the rest automatically!`,
    tags: ['nextjs', 'images', 'optimization', 'ux'],
  },
]

export async function executeCommand(
  command: string,
  openBlog?: (blogId: string) => void,
): Promise<CommandResult> {
  const cmd = command.toLowerCase().trim()

  // Find command by name or alias
  const foundCommand = COMMANDS.find(
    (c) => c.command === cmd || c.aliases?.includes(cmd),
  )

  switch (foundCommand?.command || cmd) {
    case 'help':
      return {
        lines: [
          { type: 'info', content: 'available commands:' },
          { type: 'output', content: '' },
          ...COMMANDS.map((cmd) => ({
            type: 'output' as const,
            content: `  ${cmd.command.padEnd(12)} - ${cmd.description}${cmd.aliases ? ` (${cmd.aliases.join(', ')})` : ''}`,
          })),
          { type: 'output', content: '' },
          {
            type: 'info',
            content: 'tip: use tab to autocomplete, up/down arrows for history',
          },
        ],
      }

    case 'whoami':
      return {
        lines: [
          { type: 'output', content: 'leo huynh (hta218)' },
          { type: 'output', content: 'full-stack developer & entrepreneur' },
          { type: 'output', content: 'location: ho chi minh city, vietnam 🇻🇳' },
          { type: 'output', content: 'email: contact@leohuynh.dev' },
          { type: 'output', content: 'github: @hta218' },
          { type: 'output', content: 'twitter: @hta218_' },
        ],
      }

    case 'about':
      return {
        lines: [
          { type: 'output', content: 'about leo huynh' },
          { type: 'output', content: '=================' },
          { type: 'output', content: '' },
          {
            type: 'output',
            content:
              'i started learning to code in 2016 and have been hooked ever since.',
          },
          {
            type: 'output',
            content: 'landed my first job as a python coding mentor in 2017.',
          },
          { type: 'output', content: '' },
          { type: 'output', content: 'passionate about:' },
          { type: 'output', content: '• javascript/typescript ecosystem' },
          { type: 'output', content: '• web development & modern frameworks' },
          { type: 'output', content: '• ecommerce & shopify development' },
          { type: 'output', content: '• building tools that help developers' },
          { type: 'output', content: '' },
          {
            type: 'output',
            content:
              'currently working on weaverse - the first hydrogen-driven website builder.',
          },
        ],
      }

    case 'skills':
      return {
        lines: [
          { type: 'output', content: 'technical skills' },
          { type: 'output', content: '===============' },
          { type: 'output', content: '' },
          { type: 'output', content: 'languages:' },
          {
            type: 'output',
            content: '  javascript, typescript, python, liquid',
          },
          { type: 'output', content: '' },
          { type: 'output', content: 'frontend:' },
          {
            type: 'output',
            content: '  react, next.js, remix, tailwindcss, headlessui',
          },
          { type: 'output', content: '' },
          { type: 'output', content: 'backend:' },
          { type: 'output', content: '  node.js, prisma, drizzle, supabase' },
          { type: 'output', content: '' },
          { type: 'output', content: 'ecommerce:' },
          { type: 'output', content: '  shopify, hydrogen, liquid, themekit' },
          { type: 'output', content: '' },
          { type: 'output', content: 'tools:' },
          {
            type: 'output',
            content: '  git, vscode, turborepo, vercel, railway',
          },
        ],
      }

    case 'projects':
      return {
        lines: [
          { type: 'output', content: 'featured projects' },
          { type: 'output', content: '=================' },
          { type: 'output', content: '' },
          ...PROJECTS.slice(0, 5).flatMap((project, index) => [
            {
              type: 'output' as const,
              content: `${index + 1}. ${project.title}`,
            },
            { type: 'output' as const, content: `   ${project.description}` },
            {
              type: 'output' as const,
              content: `   built with: ${project.builtWith?.join(', ') || 'various technologies'}`,
            },
            ...(project.url
              ? [
                  {
                    type: 'output' as const,
                    content: `   link: ${project.url}`,
                  },
                ]
              : []),
            { type: 'output' as const, content: '' },
          ]),
          { type: 'info', content: 'visit /projects for the complete list' },
        ],
      }

    case 'blogs':
      return {
        lines: [
          { type: 'output', content: 'recent blog posts' },
          { type: 'output', content: '=================' },
          { type: 'output', content: '' },
          ...MOCK_BLOGS.flatMap((blog, index) => [
            { type: 'output' as const, content: `${index + 1}. ${blog.title}` },
            {
              type: 'output' as const,
              content: `   published: ${blog.date} | views: ${blog.views.toLocaleString()}`,
            },
            {
              type: 'info' as const,
              content: `   type 'read ${index + 1}' to read this post`,
            },
            { type: 'output' as const, content: '' },
          ]),
          { type: 'info', content: 'visit /blog for all posts' },
        ],
      }

    case 'snippets':
      return {
        lines: [
          { type: 'output', content: 'code snippets collection' },
          { type: 'output', content: '=======================' },
          { type: 'output', content: '' },
          {
            type: 'output',
            content: '• parse function from string - javascript utility',
          },
          {
            type: 'output',
            content: '• responsive image component - react/next.js',
          },
          {
            type: 'output',
            content: '• custom hooks collection - react utilities',
          },
          {
            type: 'output',
            content: '• shopify liquid filters - theme development',
          },
          { type: 'output', content: '' },
          {
            type: 'info',
            content: 'visit /snippets for the complete collection',
          },
        ],
      }

    case 'activities':
      return {
        lines: [
          { type: 'output', content: 'recent activities' },
          { type: 'output', content: '=================' },
          { type: 'output', content: '' },
          {
            type: 'output',
            content: '🎵 last played: "the scientist" by coldplay',
          },
          {
            type: 'output',
            content: '📚 currently reading: "the pragmatic programmer"',
          },
          {
            type: 'output',
            content: '🎬 last watched: "dune: part two" (2024)',
          },
          {
            type: 'output',
            content:
              '💻 last commit: "fix: terminal ui responsiveness" (2 hours ago)',
          },
          { type: 'output', content: '🔥 github streak: 42 days' },
          { type: 'output', content: '' },
          {
            type: 'info',
            content:
              'data fetched from spotify, goodreads, imdb, and github apis',
          },
        ],
      }

    case 'hobbies':
      return {
        lines: [
          { type: 'output', content: "when i'm not coding" },
          { type: 'output', content: '===================' },
          { type: 'output', content: '' },
          {
            type: 'output',
            content: '🎵 listening to music (mostly indie, alternative rock)',
          },
          {
            type: 'output',
            content: '📚 reading tech books and sci-fi novels',
          },
          {
            type: 'output',
            content: '🎬 watching movies (sci-fi, thriller, drama)',
          },
          { type: 'output', content: '☕ exploring coffee shops in saigon' },
          { type: 'output', content: '🏃 jogging and staying active' },
          { type: 'output', content: '🎮 occasional gaming (strategy games)' },
        ],
      }

    case 'quotes':
      return {
        lines: [
          { type: 'output', content: 'favorite quotes' },
          { type: 'output', content: '===============' },
          { type: 'output', content: '' },
          {
            type: 'output',
            content: '"the best way to predict the future is to create it."',
          },
          { type: 'output', content: '- peter drucker' },
          { type: 'output', content: '' },
          {
            type: 'output',
            content:
              '"code is like humor. when you have to explain it, it\'s bad."',
          },
          { type: 'output', content: '- cory house' },
          { type: 'output', content: '' },
          {
            type: 'output',
            content: '"first, solve the problem. then, write the code."',
          },
          { type: 'output', content: '- john johnson' },
        ],
      }

    case 'music':
      return {
        lines: [
          { type: 'output', content: 'music taste' },
          { type: 'output', content: '===========' },
          { type: 'output', content: '' },
          { type: 'output', content: 'favorite artists:' },
          { type: 'output', content: '• coldplay, radiohead, the beatles' },
          { type: 'output', content: '• bon iver, the national, arcade fire' },
          { type: 'output', content: '• kings of convenience, zero 7' },
          { type: 'output', content: '' },
          { type: 'output', content: 'currently on repeat:' },
          { type: 'output', content: '🎵 "the scientist" by coldplay' },
          { type: 'output', content: '🎵 "holocene" by bon iver' },
        ],
      }

    case 'clear':
      return { clear: true }

    case 'pwd':
      return {
        lines: [{ type: 'output', content: '/home/leo/leohuynh.dev' }],
      }

    case 'date':
      return {
        lines: [{ type: 'output', content: new Date().toLocaleString() }],
      }

    default:
      // Check if it's a "read" command
      if (cmd.startsWith('read ')) {
        const blogNum = Number.parseInt(cmd.split(' ')[1])
        if (blogNum >= 1 && blogNum <= MOCK_BLOGS.length) {
          const blog = MOCK_BLOGS[blogNum - 1]
          if (openBlog) {
            openBlog(blog.id)
            return {
              lines: [{ type: 'info', content: `opening "${blog.title}"...` }],
            }
          }
        }
        return {
          lines: [
            { type: 'error', content: `invalid blog number: ${blogNum}` },
            { type: 'info', content: 'use "blogs" to see available posts' },
          ],
        }
      }

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

// Export for use in other components
export { MOCK_BLOGS }
