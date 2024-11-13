import { clsx } from 'clsx'
import { ChevronRight } from 'lucide-react'
import { Link } from '~/components/ui/link'

type TocItem = {
  value: string
  url: string
  depth: number
}

export function TableOfContents({ toc, className }: { toc: TocItem[]; className?: string }) {
  return (
    <details className={clsx('space-y-4 [&_.chevron-right]:open:rotate-90', className)} open>
      <summary className="flex cursor-pointer items-center gap-1 marker:content-none">
        <ChevronRight
          strokeWidth={1.5}
          size={20}
          className="chevron-right rotate-0 transition-transform"
        />
        <span className="text-lg font-medium">On this page</span>
      </summary>
      <ul className="flex flex-col space-y-2">
        {toc.map(({ value, depth, url }) => (
          <li
            key={url}
            className="font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            style={{ paddingLeft: (depth - 2) * 16 }}
          >
            <Link href={url}>{value}</Link>
          </li>
        ))}
      </ul>
    </details>
  )
}
