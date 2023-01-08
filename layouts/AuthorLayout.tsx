import React from 'react'
import { ProfileCard } from '~/components/ProfileCard'
import { PageSeo } from '~/components/SEO'
import { siteMetadata } from '~/data/siteMetadata'
import type { AuthorLayoutProps } from '~/types'

export function AuthorLayout({ children }: AuthorLayoutProps) {
  let title = 'About'
  let description = 'More about me and this blog'

  return (
    <>
      <PageSeo
        title={`${title} - ${siteMetadata.author} - ${siteMetadata.title}`}
        description={`${title} - ${siteMetadata.title} - ${description}`}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="items-start space-y-2 pt-8 xl:grid xl:grid-cols-3 xl:space-y-0">
          <ProfileCard />
          <div className="prose prose-lg max-w-none pb-8 dark:prose-dark xl:col-span-2 xl:pl-10">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthorLayout
