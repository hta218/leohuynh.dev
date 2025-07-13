import { clsx } from 'clsx'
import { MessageCircle, Share, ThumbsUp, X } from 'lucide-react'
import { useState } from 'react'
import type { ThemeClasses } from './types'

interface BlogPost {
  id: string
  title: string
  date: string
  content: string
  views: number
  tags: string[]
}

interface BlogViewerProps {
  post: BlogPost
  theme: ThemeClasses
  onClose: () => void
}

export function BlogViewer({ post, theme, onClose }: BlogViewerProps) {
  const [reactions, setReactions] = useState({ likes: 42, comments: 8 })
  const [hasLiked, setHasLiked] = useState(false)

  const handleLike = () => {
    setReactions((prev) => ({
      ...prev,
      likes: hasLiked ? prev.likes - 1 : prev.likes + 1,
    }))
    setHasLiked(!hasLiked)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={clsx(
          'mx-4 h-[80vh] w-full max-w-4xl overflow-hidden rounded-lg shadow-2xl',
          theme.bg,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h1 className={clsx('text-lg font-bold', theme.text)}>
              {post.title}
            </h1>
            <div className={clsx('text-sm', theme.info)}>
              {post.date} • {post.views.toLocaleString()} views
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={clsx('rounded p-1 hover:bg-gray-100', theme.text)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-full">
          <div className="flex-1 overflow-y-auto p-6">
            <div className={clsx('prose prose-lg', theme.text)}>
              {/* Simulated blog content */}
              <div className="space-y-4 whitespace-pre-wrap">
                {post.content}
              </div>

              {/* Tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className={clsx(
                      'rounded-full px-3 py-1 text-xs',
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                    )}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Reactions */}
          <div className="w-16 border-l p-2">
            <div className="flex flex-col items-center space-y-4">
              <button
                type="button"
                onClick={handleLike}
                className={clsx(
                  'flex flex-col items-center rounded p-2 text-xs',
                  hasLiked
                    ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800',
                  theme.text,
                )}
              >
                <ThumbsUp
                  size={20}
                  className={hasLiked ? 'fill-current' : ''}
                />
                <span>{reactions.likes}</span>
              </button>

              <button
                type="button"
                className={clsx(
                  'flex flex-col items-center rounded p-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800',
                  theme.text,
                )}
              >
                <MessageCircle size={20} />
                <span>{reactions.comments}</span>
              </button>

              <button
                type="button"
                className={clsx(
                  'flex flex-col items-center rounded p-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800',
                  theme.text,
                )}
              >
                <Share size={20} />
                <span>share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
