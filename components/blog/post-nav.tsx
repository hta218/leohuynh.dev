import { Link } from '~/components/ui/link'

export function PostNav({
  next,
  prev,
}: {
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}) {
  return (
    <footer>
      <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
        {prev && prev.path && (
          <div className="pt-4 xl:pt-8">
            <Link
              href={`/${prev.path}`}
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label={`Previous post: ${prev.title}`}
            >
              ← {prev.title}
            </Link>
          </div>
        )}
        {next && next.path && (
          <div className="pt-4 xl:pt-8">
            <Link
              href={`/${next.path}`}
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label={`Next post: ${next.title}`}
            >
              {next.title} →
            </Link>
          </div>
        )}
      </div>
    </footer>
  )
}
