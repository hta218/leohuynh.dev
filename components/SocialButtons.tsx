import { FacebookShareButton, TwitterShareButton } from 'react-share'
import TwitterIcon from '~/icons/twitter.svg'
import FacebookIcon from '~/icons/facebook.svg'
import { siteMetadata } from '~/data/siteMetadata'
import { Link } from './Link'
import type { SocialButtonsProps } from '~/types'

export function SocialButtons({ postUrl, title, fileName }: SocialButtonsProps) {
  let creatEditOnGithubUrl = (fileName: string) =>
    `${siteMetadata.siteRepo}/blob/main/data/blog/${fileName}`
  let createDiscussonTwitterUrl = (postUrl: string) =>
    `https://twitter.com/search?q=${encodeURIComponent(postUrl)}`

  let CREATE_DISCUS_ON_TWITTER = process.env.NEXT_PUBLIC_CREATE_DISCUS_ON_TWITTER
  let CREATE_DISCUS_ON_GITHUB = process.env.NEXT_PUBLIC_CREATE_DISCUS_ON_GITHUB
  let SHARE_ON_TWITTER = process.env.NEXT_PUBLIC_SHARE_ON_TWITTER
  let SHARE_ON_FACEBOOK = process.env.NEXT_PUBLIC_SHARE_ON_FACEBOOK

  return (
    <div className="items-center justify-between pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300 md:flex">
      <div className="mb-6 md:mb-0">
        {CREATE_DISCUS_ON_TWITTER === 'TRUE' && (
          <>
            <Link
              href={createDiscussonTwitterUrl(postUrl)}
              rel="nofollow"
              className="hover:underline"
            >
              {'Discuss on Twitter'}
            </Link>
            {` • `}
          </>
        )}
        {CREATE_DISCUS_ON_GITHUB === 'TRUE' && (
          <Link href={creatEditOnGithubUrl(fileName)} className="hover:underline">
            {'View on GitHub'}
          </Link>
        )}
      </div>
      <div className="flex items-center">
        {SHARE_ON_TWITTER === 'TRUE' && (
          <TwitterShareButton
            url={postUrl}
            title={title}
            via={siteMetadata.socialAccounts.twitter}
            className="mr-2 flex items-center overflow-hidden rounded !bg-twitter !p-1.5 hover:opacity-90"
          >
            <TwitterIcon className="h-5 w-5" fill="#fff" />
            <span className="ml-2.5 mr-1.5 font-extrabold text-white">Tweet</span>
          </TwitterShareButton>
        )}
        {SHARE_ON_FACEBOOK === 'TRUE' && (
          <FacebookShareButton
            url={postUrl}
            quote={title}
            className="mr-2 flex items-center overflow-hidden rounded !bg-facebook !p-1.5 hover:opacity-90"
          >
            <FacebookIcon className="h-5 w-5" fill="#fff" />
            <span className="ml-2.5 mr-1.5 font-extrabold text-white">Share</span>
          </FacebookShareButton>
        )}
      </div>
    </div>
  )
}
