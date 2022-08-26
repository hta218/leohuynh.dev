import React, { useState, useRef } from 'react'
import clsx from 'clsx'

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
  let className = clsx(
    `absolute z-10 right-2 top-2 w-8 h-8 p-1 rounded border-2 bg-gray-700 dark:bg-gray-800`,
    copied ? 'focus:outline-none focus:border-green-400 border-green-400' : 'border-gray-300'
  )
  return (
    <div ref={textInput} onMouseEnter={onEnter} onMouseLeave={onExit} className="relative">
      {hovered && (
        <>
          <button aria-label="Copy code" type="button" className={className} onClick={onCopy}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              className={copied ? 'text-green-400' : 'text-gray-300'}
            >
              {copied ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              )}
            </svg>
          </button>
          {copied && (
            <>
              <span className="text-base absolute z-10 top-2.5 right-12 bg-gray-300 rounded-md px-1.5 py-0.5 copy-text text-gray-800">
                Copied
              </span>
              <span className="absolute w-2 h-2 transform rotate-45 bg-gray-300 top-5 right-11" />
            </>
          )}
        </>
      )}
      <pre>{children}</pre>
    </div>
  )
}
