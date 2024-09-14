import type { Authors } from 'contentlayer/generated'
import type { ReactNode } from 'react'
import Container from '~/components/Container'
import { ProfileCard } from '~/components/ProfileCard'
import SocialAccounts from '~/components/social-accounts'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export function AuthorLayout({ children }: Props) {
  return (
    <Container className="space-y-8 divide-y divide-gray-200 pt-10 dark:divide-gray-700">
      <div className="space-y-2 pt-6 md:space-y-5">
        <h1 className="text-3xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          About
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-500 md:text-lg md:leading-7">
          More about me and this blog.
        </p>
      </div>
      <div className="items-start space-y-2 py-8 xl:grid xl:grid-cols-3 xl:space-y-0">
        <ProfileCard />
        <div className="prose pl-24 dark:prose-invert xl:col-span-2">
          {children}
          <SocialAccounts />
        </div>
      </div>
    </Container>
  )
}
