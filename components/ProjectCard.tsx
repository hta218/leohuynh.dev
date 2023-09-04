import { useTranslation } from 'next-i18next'
import useSWR from 'swr'
import type { ProjectCardProps } from '~/types/components'
import type { GithubRepository } from '~/types/server'
import { fetcher } from '~/utils/fetcher'
import { GithubRepo } from './GithubRepo'
import { Image } from './Image'
import { Link } from './Link'

export function ProjectCard({ project }: ProjectCardProps) {
  let { t } = useTranslation('common')
  let { title, description, imgSrc, url, repo, builtWith } = project
  let { data } = useSWR(`/api/github?repo=${repo}`, fetcher)
  let repository: GithubRepository = data?.repository
  let href = repository?.url || url

  return (
    <div className="md p-4 md:w-1/2" style={{ maxWidth: '544px' }}>
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-transparent shadow-nextjs dark:shadow-nextjs-dark">
        <Image
          alt={title}
          src={imgSrc}
          className="object-cover object-center md:h-36 lg:h-60"
          width={1088}
          height={612}
        />
        <div className="flex grow flex-col justify-between space-y-6 p-4 md:p-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold leading-8 tracking-tight">
              {href ? (
                <Link href={href} aria-label={`Link to ${title}`}>
                  <span data-umami-event="project-title-link">{title}</span>
                </Link>
              ) : (
                title
              )}
            </h2>
            <div className="max-w-none space-y-2 text-gray-500 dark:text-gray-400">
              <p>{repository?.description || description}</p>
              <div className="flex flex-wrap space-x-1.5">
                <span className="shrink-0">{t('projects.built_with')}:</span>
                {builtWith?.map((tool, index) => {
                  return (
                    <span key={index} className="font-semibold text-gray-600 dark:text-gray-300">
                      {tool}
                      {index !== builtWith.length - 1 && ','}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
          {repository ? (
            <GithubRepo repo={repository} />
          ) : (
            <Link
              href={url}
              className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label={`Link to ${title}`}
            >
              <span data-umami-event="project-learn-more">{t('projects.learn_more')} &rarr;</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
