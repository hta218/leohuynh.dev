import React, { useState, useRef } from 'react'
import clsx from 'clsx'
import { ClipboardCheck, Copy } from 'lucide-react'

export function Pre({ children }: { children: React.ReactNode }) {
  let textInput = useRef(null)
  let [hovered, setHovered] = useState(false)
  let [copied, setCopied] = useState(false)

  let onEnter = () => setHovered(true)
  let onExit = () => {
    setHovered(false)
    setCopied(false)
  }
  let onCopy = () => {
    setCopied(true)
    let { innerText } = textInput.current
    innerText = innerText.replace(/(\$ |copy)/g, ' ')
    navigator.clipboard.writeText(innerText)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div ref={textInput} onMouseEnter={onEnter} onMouseLeave={onExit} className="relative">
      {hovered && (
        <>
          <button
            aria-label="Copy code"
            type="button"
            className={clsx(
              `absolute z-10 right-2 top-2 w-8 h-8 p-1 rounded border bg-gray-700 dark:bg-gray-800`,
              'inline-flex items-center justify-center',
              copied
                ? 'focus:outline-none focus:border-green-400 border-green-400 text-green-400'
                : 'border-gray-300 text-gray-300'
            )}
            onClick={onCopy}
          >
            {copied ? (
              <ClipboardCheck strokeWidth={1.5} size={20} />
            ) : (
              <Copy strokeWidth={1.5} size={20} />
            )}
          </button>
          {copied && (
            <>
              <span className="copy-text absolute right-12 top-2.5 z-10 rounded-md bg-gray-300 px-1.5 py-0.5 text-base text-gray-800">
                Copied
              </span>
              <span className="absolute right-11 top-5 h-2 w-2 rotate-45 transform bg-gray-300" />
            </>
          )}
        </>
      )}
      <pre>{children}</pre>
    </div>
  )
}
