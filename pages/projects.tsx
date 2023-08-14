import { PageSeo } from 'components/SEO'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ProjectCard } from '~/components/ProjectCard'
import type { Project } from '~/types/data'

export async function getStaticProps({ locale }) {
  let projectsDataModule = await import(`~/data/${locale}/projectsData.ts`)
  let projectsData = projectsDataModule.projectsData

  return {
    props: {
      projectsData,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default function Projects({ projectsData }: { projectsData: Project[] }) {
  let workProjects = projectsData.filter(({ type }) => type === 'work')
  let sideProjects = projectsData.filter(({ type }) => type === 'self')
  let { t } = useTranslation('common')

  let description = t('projects.projects_description')

  return (
    <>
      <PageSeo
        title={`${t('projects.projects_title')} - ${t('site_meta_data.author')} - ${t(
          'site_meta_data.title'
        )}`}
        description={description}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {t('projects.projects_title')}
          </h1>
          <p className="text-base md:text-lg md:leading-7 text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
        <div className="container py-12">
          <h3 className="mb-4 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
            {t('projects.work_title')}
          </h3>
          <div className="-m-4 flex flex-wrap">
            {workProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>
        <div className="container py-12">
          <h3 className="mb-4 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
            {t('projects.side_title')}
          </h3>
          <div className="-m-4 flex flex-wrap">
            {sideProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
