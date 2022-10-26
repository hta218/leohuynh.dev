import { Image, Link } from '~/components'
import type { AuthorFrontMatter } from '~/types'

export function AuthorDetails({ authorDetails }: { authorDetails: AuthorFrontMatter[] }) {
  return (
    <ul className="flex justify-center space-x-8 xl:block sm:space-x-12 xl:space-x-0 xl:space-y-6">
      {authorDetails.map((author) => (
        <Author key={author.name} author={author} />
      ))}
    </ul>
  )
}

export function Author({ author }: { author: AuthorFrontMatter }) {
  return (
    <li className="flex items-center space-x-2">
      {author.avatar && (
        <Image
          src={author.avatar}
          width={38}
          height={38}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
      )}
      <dl className="text-sm font-medium leading-5 whitespace-nowrap">
        <dt className="sr-only">Name</dt>
        <dd className="text-gray-900 dark:text-gray-100 mb-0.5">{author.name}</dd>
        <dt className="sr-only">Twitter</dt>
        <dd>
          {author.github && (
            <>
              <Link
                href={author.github}
                className="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                {author.github.replace('https://github.com/', '@')}
              </Link>
            </>
          )}
        </dd>
      </dl>
    </li>
  )
}
