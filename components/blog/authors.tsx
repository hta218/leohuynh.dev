import type { Author } from '~/.contentlayer/generated'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import type { CoreContent } from '~/types/data'

interface AuthorsProps {
  authors: CoreContent<Author>[]
  className?: string
}

export function Authors({ authors, className }: AuthorsProps) {
  return (
    <dl className={className}>
      <dt className="sr-only">Authors</dt>
      <dd>
        <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
          {authors.map(({ name, avatar, twitter: x }) => (
            <li key={name} className="flex items-center space-x-2">
              {avatar && (
                <Image
                  src={avatar}
                  width={38}
                  height={38}
                  alt="avatar"
                  className="h-10 w-10 rounded-full"
                />
              )}
              <dl className="whitespace-nowrap text-sm font-medium leading-5">
                <dt className="sr-only">Name</dt>
                <dd className="text-gray-900 dark:text-gray-100">{name}</dd>
                <dt className="sr-only">Twitter</dt>
                <dd>
                  {x && (
                    <Link
                      href={x}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      {/* {twitter.replace('https://twitter.com/', '@').replace('https://x.com/', '@')} */}
                      {x.replace(/https:\/\/(x|twitter)\.com\//, '@')}
                    </Link>
                  )}
                </dd>
              </dl>
            </li>
          ))}
        </ul>
      </dd>
    </dl>
  )
}
