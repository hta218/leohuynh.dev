import { useEffect } from 'react'
import smoothscroll from 'smoothscroll-polyfill'

const ScrollTop = () => {
  useEffect(() => {
    smoothscroll.polyfill()
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      aria-label="Scroll To Top"
      type="button"
      onClick={handleClick}
      className="hidden md:inline-block fixed right-8 bottom-8 rounded-md bg-gray-800 text-gray-100 p-3"
    >
      <svg
        className="w-6 h-6"
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

export default ScrollTop
