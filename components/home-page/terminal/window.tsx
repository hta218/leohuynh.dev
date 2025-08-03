'use client'

import { clsx } from 'clsx'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { FONTS, FontSelector } from './font-selector'
import { THEMES, ThemeSelector } from './theme-selector'
import type { Font, Theme } from './types'

interface WindowProps {
  title: ReactNode
  children: ReactNode
  defaultWidth?: number
  defaultHeight?: number
  className?: string
}

export function Window({
  title,
  children,
  defaultWidth = 1200,
  defaultHeight = 600,
  className,
}: WindowProps) {
  let [font, setFont] = useState<Font>(FONTS[0])
  let [theme, setTheme] = useState<Theme>(THEMES[0])
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

  return (
    <div
      ref={containerRef}
      className={clsx(
        'relative mx-auto rounded-lg border shadow-2xl flex flex-col',
        'bg-(--terminal-bg)',
        'text-(--terminal-text)',
        '[&_[data-terminal-prompt]]:text-(--terminal-prompt)',
        '[&_[data-terminal-command]]:text-(--terminal-command)',
        '[&_[data-terminal-info]]:text-(--terminal-info)',
        '[&_[data-terminal-error]]:text-(--terminal-error)',
        '[&_[data-terminal-accent]]:text-(--terminal-accent)',
        font?.class,
        className,
      )}
      style={
        {
          width: `${windowSize.width}px`,
          height: `${windowSize.height}px`,
          maxWidth: '95vw',
          maxHeight: '90vh',
          '--terminal-bg': theme.variables.bg,
          '--terminal-text': theme.variables.text,
          '--terminal-prompt': theme.variables.prompt,
          '--terminal-command': theme.variables.command,
          '--terminal-info': theme.variables.info,
          '--terminal-error': theme.variables.error,
          '--terminal-accent': theme.variables.accent,
        } as React.CSSProperties
      }
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
          className={clsx('w-full h-full')}
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
      <div className="flex items-center justify-between border-b border-current/20 px-4 py-3 text-sm">
        <div className="flex items-center justify-around space-x-2">
          <div className="flex space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
        </div>
        <div className="flex items-center">{title}</div>
        <div className="flex items-center space-x-1.5">
          <FontSelector currentFont={font} onChange={setFont} />
          <div className="h-3 w-px border-r border-current/20" />
          <ThemeSelector currentTheme={theme} onChange={setTheme} />
        </div>
      </div>

      {/* Window Content */}
      <div className="overflow-hidden grow">{children}</div>
    </div>
  )
}

function getResizeCursor(direction: string) {
  switch (direction) {
    case 'right':
    case 'left':
      return 'ew-resize'
    case 'bottom':
    case 'top':
      return 'ns-resize'
    case 'bottom-right':
    case 'top-left':
      return 'nwse-resize'
    case 'bottom-left':
    case 'top-right':
      return 'ne-resize'
    default:
      return 'default'
  }
}
