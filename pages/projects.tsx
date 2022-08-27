import { PageSeo } from 'components/SEO'
import { ProjectCard } from '~/components'
import { projectsData, siteMetadata } from '~/data'

export default function Projects() {
  let workProjects = projectsData.filter(({ type }) => type === 'work')
  let sideProjects = projectsData.filter(({ type }) => type === 'self')
  let description = 'My open source side projects and stuff that I built with my colleagues at work'

  return (
    <>
      <PageSeo title={`Projects - ${siteMetadata.author}`} description={description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Projects
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="container py-12">
          <h3 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 mb-4">
            Work
          </h3>
          <div className="flex flex-wrap -m-4">
            {workProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>
        <div className="container py-12">
          <h3 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 mb-4">
            Side Projects
          </h3>
          <div className="flex flex-wrap -m-4">
            {sideProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
