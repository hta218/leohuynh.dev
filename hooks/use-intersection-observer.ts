import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useIntersectionObserver({
  threshold = 0,
  rootMargin = '0px',
  triggerOnce = false,
}: UseIntersectionObserverOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const targetRef = useRef<HTMLDivElement>(null)
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    if (!('IntersectionObserver' in window)) {
      setIsIntersecting(true)
      return
    }

    if (triggerOnce && hasTriggeredRef.current) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting

        if (isCurrentlyIntersecting) {
          setIsIntersecting(true)
          if (triggerOnce) {
            hasTriggeredRef.current = true
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false)
        }
      },
      {
        threshold,
        rootMargin,
      },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce])

  return { targetRef, isIntersecting }
}
