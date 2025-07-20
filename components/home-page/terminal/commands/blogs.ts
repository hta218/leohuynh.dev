import type { CommandResult } from '../types'

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

export const execute = async (): Promise<CommandResult> => {
  return {
    lines: [
      { type: 'output', content: 'recent blog posts' },
      { type: 'output', content: '=================' },
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
}

// Export for use in other components
export { MOCK_BLOGS }
