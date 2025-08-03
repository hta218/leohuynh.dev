import clsx from 'clsx'
import { Star } from 'lucide-react'
import Link from 'next/link'
import useSWR from 'swr'
import { Brand, type BrandsMap } from '~/components/ui/brand'
import { TerminalLoading } from '~/components/ui/terminal-loading'
import { PROJECTS } from '~/data/projects'
import type { GithubRepository } from '~/types/data'
import { fetcher } from '~/utils/misc'
import type { CommandResult } from '../types'

interface ProjectItemProps {
  project: (typeof PROJECTS)[0]
  index: number
}

function ProjectItem({ project, index }: ProjectItemProps) {
  let { title, description, url, repo, builtWith } = project
  let { isLoading, data: repository } = useSWR<GithubRepository>(
    repo ? `/api/github?repo=${repo}` : null,
    fetcher,
  )

  let href = repository?.url || url
  let stars = repository?.stargazerCount
  let projectDescription = repository?.description || description

  if (isLoading) {
    return (
      <div className="lowercase flex items-center flex-wrap">
        <strong>
          {index + 1}. {title}
        </strong>
        <TerminalLoading className="ml-2" />
      </div>
    )
  }

  return (
    <div className="lowercase space-y-1">
      <div className="flex items-center flex-wrap">
        <strong>
          {index + 1}. {title}
        </strong>
        {href && (
          <>
            <span className="mx-3">•</span>
            <Link
              href={href}
              target="_blank"
              className="hover:underline underline-offset-4"
            >
              {href}
            </Link>
          </>
        )}
      </div>
      <div className="pl-7 space-y-1">
        <div data-terminal-info>{projectDescription}</div>
        {stars && (
          <div className="flex items-center gap-1.5">
            github stars: <Star size={20} strokeWidth={1.5} /> {stars}
          </div>
        )}
        {builtWith?.length ? (
          <div className="flex flex-wrap items-center gap-2">
            <span>stack:</span>
            <div className="flex h-6 flex-wrap items-center gap-2">
              {builtWith?.map((tool) => {
                return (
                  <Brand
                    key={tool}
                    name={tool as keyof typeof BrandsMap}
                    iconClassName={clsx(tool === 'Pygame' ? 'h-5' : 'h-5 w-5')}
                  />
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export async function execute(): Promise<CommandResult> {
  let workProjects = PROJECTS.filter((project) => project.type === 'work')
  let sideProjects = PROJECTS.filter((project) => project.type === 'self')

  return {
    lines: [
      { type: 'output', content: 'things i built at work' },
      { type: 'output', content: '===================' },
      {
        type: 'component',
        component: () => (
          <div className="space-y-2">
            {workProjects.map((project, index) => (
              <ProjectItem
                key={project.title}
                project={project}
                index={index}
              />
            ))}
          </div>
        ),
      },
      { type: 'output', content: '' },
      { type: 'output', content: 'side projects' },
      { type: 'output', content: '=============' },
      {
        type: 'component',
        component: () => (
          <div className="space-y-2">
            {sideProjects.map((project, index) => (
              <ProjectItem
                key={project.title}
                project={project}
                index={index}
              />
            ))}
          </div>
        ),
      },
    ],
  }
}
