'use client'

import { clsx } from 'clsx'
import { useEffect, useState } from 'react'

interface TerminalLoadingProps {
  text?: string
  speed?: number
  className?: string
}

const SPINNER_CHARS = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

export function TerminalLoading({
  text,
  className = '',
  speed = 100,
}: TerminalLoadingProps) {
  const [currentChar, setCurrentChar] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentChar((prev) => (prev + 1) % SPINNER_CHARS.length)
    }, speed)

    return () => clearInterval(interval)
  }, [speed])

  return (
    <span className={clsx('inline-flex items-center', className)}>
      <span className="font-mono">{SPINNER_CHARS[currentChar]}</span>
      {text && <span className="ml-1">{text}</span>}
    </span>
  )
}
