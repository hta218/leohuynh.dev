import React from 'react'
import { PageSeo, ProfileCard } from '~/components'
import { siteMetadata } from '~/data'
import type { AuthorLayoutProps } from '~/types'

export function AuthorLayout({ children }: AuthorLayoutProps) {
  let title = 'About me'
  let description = 'More about me and myself'

  return (
    <>
      <PageSeo
        title={`${title} - ${siteMetadata.author} - ${siteMetadata.title}`}
        description={`${title} - ${siteMetadata.title} - ${description}`}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0 pt-8">
          <ProfileCard />
          <div className="pb-8 xl:pl-8 prose prose-lg dark:prose-dark max-w-none xl:col-span-2">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthorLayout
