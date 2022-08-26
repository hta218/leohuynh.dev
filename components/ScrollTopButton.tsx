import { useEffect, useState } from 'react'
import smoothscroll from 'smoothscroll-polyfill'

export function ScrollTopButton() {
  let [show, setShow] = useState(false)

  useEffect(() => {
    smoothscroll.polyfill()
    let handleWindowScroll = () => {
      if (window.scrollY > 200) setShow(true)
      else setShow(false)
    }

    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  let handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      aria-label="Scroll To Top"
      type="button"
      onClick={handleClick}
      style={{ opacity: show ? 1 : 0 }}
      className="hidden md:inline-block transition-opacity fixed right-8 bottom-8 rounded-md bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-gray-100 p-2"
    >
      <svg
        className="w-5.5 h-5.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  )
}
