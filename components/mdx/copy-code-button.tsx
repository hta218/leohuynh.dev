'use client'

import { clsx } from 'clsx'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

let timeoutId: ReturnType<typeof setTimeout> | undefined

export function CopyCodeButton({
  className,
  parent,
}: {
  className?: string
  parent: 'code-title' | 'code-block'
}) {
  let [copied, setCopied] = useState(false)

  function handleCopy(e: React.MouseEvent<HTMLButtonElement>) {
    let button = e.currentTarget
    let preTag: HTMLPreElement | null = null
    if (parent === 'code-block') {
      preTag = button.nextElementSibling as HTMLPreElement
    } else if (parent === 'code-title') {
      let figure = button.parentElement?.nextElementSibling
      preTag = figure?.querySelector('pre') as HTMLPreElement
    }
    if (preTag) {
      navigator.clipboard.writeText(preTag.textContent!)
      setCopied(true)
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      aria-label="Copy code"
      className={clsx([
        'copy-code',
        'bg-solarized-light p-2 dark:bg-github-dark-dimmed',
        className,
      ])}
      onClick={handleCopy}
    >
      {copied ? <Check className="h-4.5 w-4.5" /> : <Copy className="h-4.5 w-4.5" />}
    </button>
  )
}
