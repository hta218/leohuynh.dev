'use client'

import { Check, Copy } from 'lucide-react'
import { useState, useRef, type ReactNode } from 'react'

let timeoutId: ReturnType<typeof setTimeout> | undefined

export function Pre({ children }: { children: ReactNode }) {
  let textInput = useRef<HTMLDivElement>(null)
  let [copied, setCopied] = useState(false)

  return (
    <div
      ref={textInput}
      className="relative overflow-hidden rounded-lg border border-gray-100 dark:border-gray-700"
    >
      <button
        aria-label="Copy code"
        className="absolute right-3 top-3 hidden bg-solarized-light p-2 lg:inline-block"
        onClick={() => {
          if (textInput.current) {
            navigator.clipboard.writeText(textInput.current.textContent!)
            setCopied(true)
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => setCopied(false), 2000)
          }
        }}
      >
        {copied ? <Check className="h-4.5 w-4.5" /> : <Copy className="h-4.5 w-4.5" />}
      </button>
      <pre className="bg-solarized-light text-[#657B83] dark:bg-[#22272e]">{children}</pre>
    </div>
  )
}
