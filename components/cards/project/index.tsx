import clsx from 'clsx'
import { Github } from 'lucide-react'
import { Fragment } from 'react'
import type { BrandsMap } from '~/components/ui/brand'
import { Brand } from '~/components/ui/brand'
import { GradientBorder } from '~/components/ui/gradient-border'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Image } from '~/components/ui/image'
import { Link } from '~/components/ui/link'
import { TiltedGridBackground } from '~/components/ui/tilted-grid-background'
import type { PROJECTS } from '~/data/projects'
import type { GithubRepository } from '~/types/data'

export function ProjectCard({ project }: { project: (typeof PROJECTS)[0] }) {
  let { title, description, imgSrc, url, repo, builtWith, links } = project
  let repository = repo as GithubRepository
  let href = repository?.url || url
  let lang = repository?.languages?.[0]

  return (
    <GradientBorder
      offset={28}
      className="flex flex-col rounded-[40px] p-6 [box-shadow:0_8px_32px_rgba(194,194,218,.3)] dark:bg-white/5 dark:shadow-none md:p-8"
    >
      <TiltedGridBackground className="inset-0 z-[-1] rounded-[40px]" />
      <div className="mb-6 flex items-center gap-4">
        <Image src={imgSrc} alt={title} width={100} height={100} className="h-15 w-15 shrink-0" />
        <div className="flex flex-col items-start gap-1 pt-1">
          <h2 className="text-[22px] font-bold leading-[30px]">
            {href ? (
              <Link href={href} aria-label={`Link to ${title}`}>
                <GrowingUnderline data-umami-event="project-title-link">{title}</GrowingUnderline>
              </Link>
            ) : (
              title
            )}
          </h2>
        </div>
      </div>
      <p className="mb-16 line-clamp-3 grow text-lg">{repository?.description || description}</p>
      <div
        className={clsx(
          'mt-auto flex gap-6 sm:gap-9 md:grid md:gap-0',
          repository ? 'grid-cols-3' : 'grid-cols-2'
        )}
      >
        {repository ? (
          <div className="space-y-1.5">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <span className="hidden sm:inline">Github stars</span>
              <span className="sm:hidden">Stars</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-1.5">
                <Github size={16} strokeWidth={1.5} />
                <span className="font-medium">{repository?.stargazerCount}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="text-xs text-gray-600 dark:text-gray-400">Links</div>
            <div className="flex flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:gap-1.5">
              {links?.map(({ title, url }, idx) => (
                <Fragment key={url}>
                  <Link href={url} className="flex items-center gap-1.5">
                    <GrowingUnderline className="font-medium" data-umami-event="project-link">
                      {title}
                    </GrowingUnderline>
                  </Link>
                  {idx !== links.length - 1 && (
                    <span className="hidden text-gray-400 dark:text-gray-500 md:inline">|</span>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-1.5">
          <div className="text-xs text-gray-600 dark:text-gray-400">Stack</div>
          <div className="flex h-6 flex-wrap items-center gap-1.5">
            {builtWith?.map((tool) => {
              return (
                <Brand
                  key={tool}
                  name={tool as keyof typeof BrandsMap}
                  iconClassName={clsx(tool === 'Pygame' ? 'h-4' : 'h-4 w-4')}
                />
              )
            })}
          </div>
        </div>
        {lang && (
          <div className="space-y-1.5">
            <div className="text-xs text-gray-600 dark:text-gray-400">Language</div>
            <div className="flex items-center gap-1.5">
              <Brand name={lang.name as keyof typeof BrandsMap} as="icon" className="h-4 w-4" />
              <span className="font-medium">{lang.name}</span>
            </div>
          </div>
        )}
      </div>
    </GradientBorder>
  )
}
