'use client'

import { clsx } from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { Link } from '~/components/ui/link'

type TocItem = {
  value: string
  url: string
  depth: number
}

function useActiveTocItem(ids: string[]) {
  let [inViewIds, setInViewIds] = useState<string[]>([])
  let observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (document) {
      let headings = ids.map((id) => document.querySelector(id))
      observer.current?.disconnect()
      observer.current = new IntersectionObserver(
        (entries) => {
          for (let { intersectionRatio, target } of entries) {
            if (intersectionRatio > 0) {
              if (!inViewIds.includes(target.id)) {
                setInViewIds([...inViewIds, target.id])
              }
            } else {
              if (inViewIds.includes(target.id) && inViewIds.length > 1) {
                setInViewIds(inViewIds.filter((id) => id !== target.id))
              }
            }
          }
        },
        { rootMargin: '-96px 0% 0% 0%' }
      )
      for (let el of headings) {
        el && observer.current.observe(el)
      }
      return () => observer.current?.disconnect()
    }
  }, [ids])

  return inViewIds[0]
}

export function TableOfContents({ toc, className }: { toc: TocItem[]; className?: string }) {
  let ids = toc.map((item) => item.url)
  let activeId = useActiveTocItem(ids)

  return (
    <div className={clsx('space-y-4', className)}>
      <h3 className="text-2xl font-semibold">On this page</h3>
      <ul className="flex flex-col space-y-2">
        {toc.map(({ value, depth, url }) => (
          <li
            key={url}
            className={clsx([
              'font-medium',
              url === `#${activeId}`
                ? 'text-gray-700 dark:text-gray-200'
                : 'text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200',
            ])}
            style={{ paddingLeft: (depth - 2) * 16 }}
          >
            <Link href={url}>{value}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
