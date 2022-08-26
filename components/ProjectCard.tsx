import type { ProjectCardProps } from '~/types'
import { Image } from './Image'
import { Link } from './Link'

export function ProjectCard({ project }: ProjectCardProps) {
  let { title, description, imgSrc, href, repoName } = project

  return (
    <div className="p-4 md:w-1/2 md" style={{ maxWidth: '544px' }}>
      <div className="h-full overflow-hidden border dark:hover:border-gray-400 dark:border-gray-600 border-gray-400 hover:border-gray-500 rounded-md border-opacity-60">
        <Image
          alt={title}
          src={imgSrc}
          className="object-cover object-center lg:h-48 md:h-36"
          width={1088}
          height={612}
        />
        <div className="p-6">
          <div className="flex justify-between mb-3">
            <h2 className="text-2xl font-bold leading-8 tracking-tight">
              {href ? (
                <Link href={href} aria-label={`Link to ${title}`}>
                  {title}
                </Link>
              ) : (
                title
              )}
            </h2>
            {!repoName ? null : (
              <div className="flex-shrink-0 mt-0.5">
                <Image
                  alt={title}
                  src={`https://img.shields.io/github/stars/hta218/${repoName}.svg?style=social&label=Stars&maxAge=2592000`}
                  shouldOpenLightbox={false}
                  width={112}
                  height={28}
                />
              </div>
            )}
          </div>
          <p className="mb-3 prose text-gray-500 max-w-none dark:text-gray-400">{description}</p>
          {href && (
            <Link
              href={href}
              className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label={`Link to ${title}`}
            >
              Learn more &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
