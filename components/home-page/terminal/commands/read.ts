import type { CommandResult } from '../types'
import { MOCK_BLOGS } from './blogs'

export const execute = async (
  blogNum: number,
  openBlog?: (blogId: string) => void,
): Promise<CommandResult> => {
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
