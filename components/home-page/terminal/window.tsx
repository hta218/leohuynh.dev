'use client'

import { clsx } from 'clsx'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { FontSelector } from './font-selector'
import { ThemeSelector } from './theme-selector'

interface WindowProps {
  title?: string
  children: ReactNode
  defaultWidth?: number
  defaultHeight?: number
  font: string
  theme: string
  onFontChange: (font: string) => void
  onThemeChange: (theme: string) => void
  themeClasses: {
    bg: string
    text: string
    prompt: string
    command: string
    info: string
    error: string
    accent: string
  }
  className?: string
}

export function Window({
  title = 'leo@leohuynh.dev: ~',
  children,
  defaultWidth = 1200,
  defaultHeight = 600,
  font,
  theme,
  onFontChange,
  onThemeChange,
  themeClasses,
  className,
}: WindowProps) {
  // Window resizing state
  const [windowSize, setWindowSize] = useState({
    width: defaultWidth,
    height: defaultHeight,
  })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string>('')

  const containerRef = useRef<HTMLDivElement>(null)

  // Handle window resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const minWidth = 600
      const minHeight = 400
      const maxWidth = window.innerWidth - 100
      const maxHeight = window.innerHeight - 100

      let newWidth = windowSize.width
      let newHeight = windowSize.height

      if (resizeDirection.includes('right')) {
        newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX - rect.left))
      }
      if (resizeDirection.includes('left')) {
        newWidth = Math.max(
          minWidth,
          Math.min(maxWidth, rect.right - e.clientX),
        )
      }
      if (resizeDirection.includes('bottom')) {
        newHeight = Math.max(
          minHeight,
          Math.min(maxHeight, e.clientY - rect.top),
        )
      }
      if (resizeDirection.includes('top')) {
        newHeight = Math.max(
          minHeight,
          Math.min(maxHeight, rect.bottom - e.clientY),
        )
      }

      setWindowSize({ width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeDirection('')
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = getResizeCursor(resizeDirection)
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, resizeDirection, windowSize])

  const getResizeCursor = (direction: string) => {
    switch (direction) {
      case 'right':
      case 'left':
        return 'ew-resize'
      case 'bottom':
      case 'top':
        return 'ns-resize'
      case 'bottom-right':
      case 'top-left':
        return 'nw-resize'
      case 'bottom-left':
      case 'top-right':
        return 'ne-resize'
      default:
        return 'default'
    }
  }

  const getFontClass = () => {
    switch (font) {
      case 'mono':
        return 'font-mono'
      case 'jetbrains':
        return 'font-jetbrains'
      case 'fira':
        return 'font-fira'
      case 'source':
        return 'font-source'
      default:
        return 'font-mono'
    }
  }

  return (
    <div
      ref={containerRef}
      className={clsx(
        'terminal-container relative mx-auto rounded-lg border shadow-2xl',
        themeClasses.bg,
        getFontClass(),
        className,
      )}
      style={{
        width: `${windowSize.width}px`,
        height: `${windowSize.height}px`,
        maxWidth: '95vw',
        maxHeight: '90vh',
      }}
      onMouseMove={(e) => {
        if (isResizing) return

        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const edgeThreshold = 15

        let cursor = 'default'
        let direction = ''

        // Check edges
        const nearRight = x >= rect.width - edgeThreshold
        const nearBottom = y >= rect.height - edgeThreshold

        if (nearRight && nearBottom) {
          cursor = 'nw-resize'
          direction = 'bottom-right'
        } else if (nearRight) {
          cursor = 'ew-resize'
          direction = 'right'
        } else if (nearBottom) {
          cursor = 'ns-resize'
          direction = 'bottom'
        }

        e.currentTarget.style.cursor = cursor
      }}
      onMouseLeave={(e) => {
        if (!isResizing) {
          e.currentTarget.style.cursor = 'default'
        }
      }}
      onMouseDown={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const edgeThreshold = 15

        let direction = ''
        const nearRight = x >= rect.width - edgeThreshold
        const nearBottom = y >= rect.height - edgeThreshold

        if (nearRight && nearBottom) {
          direction = 'bottom-right'
        } else if (nearRight) {
          direction = 'right'
        } else if (nearBottom) {
          direction = 'bottom'
        }

        if (direction) {
          e.preventDefault()
          setIsResizing(true)
          setResizeDirection(direction)
        }
      }}
    >
      {/* Resize indicator in bottom-right corner */}
      <div className="absolute bottom-0 right-0 w-6 h-6 p-1 opacity-40 pointer-events-none">
        <svg
          viewBox="0 0 12 12"
          className={clsx('w-full h-full', themeClasses.text)}
          fill="currentColor"
          aria-label="Resize window"
        >
          <title>Resize window</title>
          <path d="M12 0v12L0 12z" opacity="0.15" />
          <path d="M8 4v8L4 8z" opacity="0.4" />
          <path d="M12 4v8L8 8z" opacity="0.6" />
          <path d="M8 0v4L4 4z" opacity="0.4" />
          <path d="M12 0v4L8 4z" opacity="0.8" />
        </svg>
      </div>

      {/* Window Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <span className={clsx('ml-4 text-sm font-medium', themeClasses.text)}>
            {title}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <FontSelector
            currentFont={font}
            onChange={onFontChange}
            theme={themeClasses}
          />
          <div className="h-4 w-px border-r border-gray-500" />
          <ThemeSelector currentTheme={theme} onChange={onThemeChange} />
        </div>
      </div>

      {/* Window Content */}
      <div
        className="overflow-hidden"
        style={{ height: `${windowSize.height - 60}px` }}
      >
        {children}
      </div>
    </div>
  )
}
