import type { AuthorFrontMatter } from '~/types/mdx'
import { Link } from '../Link'
import { Image } from '../Image'

export function AuthorDetails({ authorDetails }: { authorDetails: AuthorFrontMatter[] }) {
  return (
    <ul className="flex justify-center space-x-8 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-6">
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
          className="h-10 w-10 rounded-full"
        />
      )}
      <dl className="whitespace-nowrap text-sm font-medium leading-5">
        <dt className="sr-only">Name</dt>
        <dd className="mb-0.5 text-gray-900 dark:text-gray-100">{author.name}</dd>
        <dt className="sr-only">Github</dt>
        <dd>
          {author.github && (
            <>
              <Link
                href={author.github}
                className="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
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
