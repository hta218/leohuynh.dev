import { genPageMetadata } from 'app/seo'
import Container from '~/components/Container'
import { ProjectCard } from '~/components/project-card'
import { PROJECTS_DATA } from '~/data/projectsData'
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
    <Container className="space-y-8 divide-y divide-gray-200 pt-10 dark:divide-gray-700">
      <div className="space-y-2 pt-6 md:space-y-5">
        <h1 className="text-3xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Projects
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-500 md:text-lg md:leading-7">
          My open-source side projects and stuff that I built with my colleagues at work
        </p>
      </div>
      <div className="py-12">
        <h3 className="mb-8 text-3xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
          Work
        </h3>
        <div className="space-y-16">
          {workProjects.map((pro, idx) => (
            <ProjectCard key={pro.title} project={pro} reversed={idx % 2 === 1} />
          ))}
        </div>
      </div>
      <div className="py-12">
        <h3 className="mb-8 text-3xl font-semibold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
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
