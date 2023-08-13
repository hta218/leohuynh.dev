import { useEffect, useRef } from 'react'

export default function ToC({ toc }) {
  const navRef = useRef(null)
  const activeIdRef = useRef(null)

  useEffect(() => {
    console.log('useEffect executed')

    const observerOptions = {
      rootMargin: '-10px 0px 0px 0px',
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      console.log('Observer triggered')

      let firstActiveId = null

      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          if (
            !firstActiveId ||
            entry.target.getBoundingClientRect().top <
              document.querySelector(`#${firstActiveId}`).getBoundingClientRect().top
          ) {
            firstActiveId = entry.target.getAttribute('id')
          }
        }
      })

      if (firstActiveId && activeIdRef.current !== firstActiveId) {
        if (activeIdRef.current) {
          const previousActiveAnchor = navRef.current.querySelector(
            `li a[href="#${activeIdRef.current}"]`
          )
          if (previousActiveAnchor) {
            previousActiveAnchor.classList.remove('text-gray-600')
          }
        }

        const currentActiveAnchor = navRef.current.querySelector(`li a[href="#${firstActiveId}"]`)
        if (currentActiveAnchor) {
          currentActiveAnchor.classList.add('text-gray-600')
        }

        activeIdRef.current = firstActiveId
      }
    }, observerOptions)

    // Track only the headers that are in the ToC
    toc.forEach((item) => {
      const header = document.querySelector(item.url)
      if (header) {
        observer.observe(header)
        console.log('Observer added: ' + header.getAttribute('id'))
      }
    })

    // Cleanup the observer when the component is unmounted
    return () => observer.disconnect()
  }, [toc])

  const handleLinkClick = (e, itemUrl) => {
    e.preventDefault()
    const targetElement = document.querySelector(itemUrl)
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Adjust this value as needed
        behavior: 'smooth',
      })
    }
  }

  return (
    <nav ref={navRef} className="pl-0  md:sticky top-24 self-start">
      <ul className="list-none pl-4">
        {toc.map((item, index) => (
          <li key={index} className="ml-4 my-1">
            <a
              href={item.url}
              onClick={(e) => handleLinkClick(e, item.url)}
              className="block py-0.5 text-gray-400 hover:text-gray-600 transition ease-in-out duration-150"
            >
              {item.value}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
