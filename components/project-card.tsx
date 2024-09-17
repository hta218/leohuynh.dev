import type { PROJECTS_DATA } from '~/data/projectsData'
import type { GithubRepository } from '~/types/server'
import type { BrandsMap } from './Brands'
import { Brand } from './Brands'
import { GithubRepo } from './github-repo'
import Image from './Image'
import Link from './Link'
import clsx from 'clsx'

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
    <div className="relative">
      <div className="absolute -inset-2 z-[0] rounded-[20px] shadow-sm ring-1 ring-black/5" />
      <div
        className={clsx([
          'relative z-[1] flex h-72 overflow-hidden rounded-xl shadow-2xl',
          reversed && 'flex-row-reverse',
        ])}
        style={{ background: 'conic-gradient(at 0% 0%, snow, white)' }}
      >
        <div className="flex w-1/2 items-end p-8">
          <div className="border-grey-200 relative h-full w-full rounded-2xl border dark:border-zinc-800">
            <span className="absolute -top-px right-px h-px w-[40%] bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0"></span>
            <span className="absolute -left-px h-[40%] w-px bg-gradient-to-b from-blue-500/0 via-blue-500/40 to-blue-500/0 dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0"></span>
            <Image
              alt={title}
              src={imgSrc}
              className="h-full max-h-full rounded-2xl object-cover object-center shadow-lg"
              width={1000}
              height={1000}
            />
          </div>
        </div>
        <div className="flex w-1/2 grow flex-col justify-between space-y-6 p-8 md:p-6">
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
                      iconClassName={clsx(tool === 'Pygame' ? 'h-5.5' : 'h-5.5 w-5.5')}
                    />
                  )
                })}
              </div>
              <p className="text-gray-600 dark:text-gray-500">
                {/* {repository?.description || description} */}
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas, dolores? Corrupti at
                eum eos. Est et deleniti tempora, ipsum nisi autem. Cupiditate iure deleniti fugit
                quod rem, nisi ipsa alias.
              </p>
            </div>
          </div>
          {repository ? (
            <GithubRepo repo={repository} />
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
      </div>
    </div>
  )
}
