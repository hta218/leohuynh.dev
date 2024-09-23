import { genPageMetadata } from 'app/seo'
import { ProjectCard } from '~/components/cards/project'
import { Container } from '~/components/ui/container'
import { PageHeader } from '~/components/ui/page-header'
import { PROJECTS_DATA } from '~/data/projects-data'
import { fetchProjectRepoData } from './github'

export let metadata = genPageMetadata({ title: 'Projects' })

export default async function Projects() {
  await Promise.all(
    PROJECTS_DATA.map(async (pro) => {
      pro.repo = await fetchProjectRepoData(pro)
    })
  )
  let workProjects = PROJECTS_DATA.filter(({ type }) => type === 'work')
  let sideProjects = PROJECTS_DATA.filter(({ type }) => type === 'self')

  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Projects"
        description="My open-source side projects and stuff that I built with my colleagues at work."
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="py-5 md:py-10">
        <h3 className="mb-6 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl">
          Work
        </h3>
        <div className="space-y-16">
          {workProjects.map((pro, idx) => (
            <ProjectCard key={pro.title} project={pro} reversed={idx % 2 === 1} />
          ))}
        </div>
      </div>
      <div className="mt-6 border-t border-gray-200 py-5 dark:border-gray-700 md:mt-10 md:py-10">
        <h3 className="mb-6 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:mb-8 md:text-3xl">
          Side projects
        </h3>
        <div className="space-y-16">
          {sideProjects.map((pro, idx) => (
            <ProjectCard
              key={pro.title}
              project={pro}
              reversed={workProjects.length % 2 === 1 && idx % 2 === 0}
            />
          ))}
        </div>
      </div>
    </Container>
  )
}
