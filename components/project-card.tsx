import type { PROJECTS_DATA } from '~/data/projectsData'
import type { GithubRepository } from '~/types/server'
import type { BrandsMap } from './Brands'
import { Brand } from './Brands'
import { RepoMeta } from './repo-meta'
import Image from './Image'
import Link from './Link'
import clsx from 'clsx'
import { GradientBorder } from './gradient-border'
import { RadiantCard } from './radiant-card'

export function ProjectCard({
  project,
  reversed,
}: {
  project: (typeof PROJECTS_DATA)[0]
  reversed?: boolean
}) {
  let { title, description, imgSrc, url, repo, builtWith } = project
  let repository = repo as GithubRepository
  let href = repository?.url || url

  return (
    <RadiantCard
      className={clsx([
        'flex flex-col gap-4 p-3 md:h-80 md:flex-row md:gap-12 md:p-8',
        reversed && 'md:flex-row-reverse',
      ])}
    >
      <div className="flex items-end md:w-1/2">
        <GradientBorder className="rounded-2xl">
          <Image
            alt={title}
            src={imgSrc}
            className="h-full max-h-full w-full rounded-2xl object-cover object-center shadow-lg"
            width={1000}
            height={1000}
          />
        </GradientBorder>
      </div>
      <div className="flex grow flex-col justify-between space-y-6 pb-1 md:w-1/2 md:pb-0">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold leading-8">
            {href ? (
              <Link href={href} aria-label={`Link to ${title}`}>
                <span data-umami-event="project-title-link" className="background-underline">
                  {title}
                </span>
              </Link>
            ) : (
              title
            )}
          </h2>
          <div className="max-w-none space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {builtWith?.map((tool) => {
                return (
                  <Brand
                    key={tool}
                    type={tool as keyof typeof BrandsMap}
                    iconClassName={clsx(
                      tool === 'Pygame' ? 'h-5 md:h-5.5' : 'h-5 w-5 md:h-5.5 md:w-5.5'
                    )}
                  />
                )
              })}
            </div>
            <p className="line-clamp-3 text-gray-600 dark:text-gray-500">
              {/* {repository?.description || description} */}
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas, dolores? Corrupti at
              eum eos. Est et deleniti tempora, ipsum nisi autem. Cupiditate iure deleniti fugit
              quod rem, nisi ipsa alias.
            </p>
          </div>
        </div>
        {repository ? (
          <RepoMeta repo={repository} />
        ) : (
          <Link
            href={url!}
            className="text-base font-medium leading-6"
            aria-label={`Link to ${title}`}
          >
            <span className="background-underline" data-umami-event="project-learn-more">
              Learn more &rarr;
            </span>
          </Link>
        )}
      </div>
    </RadiantCard>
  )
}
