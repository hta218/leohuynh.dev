import { FacebookShareButton, TwitterShareButton } from 'react-share'
import TwitterIcon from 'components/social-icons/twitter.svg'
import FacebookIcon from 'components/social-icons/facebook.svg'
import { siteMetadata } from '~/data'
import { Link } from './Link'
import type { SocialButtonsProps } from '~/types'

export function SocialButtons({ postUrl, title, fileName }: SocialButtonsProps) {
  let creatEditOnGithubUrl = (fileName: string) =>
    `${siteMetadata.siteRepo}/blob/main/data/blog/${fileName}`
  let createDiscussonTwitterUrl = (postUrl: string) =>
    `https://twitter.com/search?q=${encodeURIComponent(postUrl)}`

  return (
    <div className="md:flex justify-between items-center pt-6 pb-6 text-sm text-gray-700 dark:text-gray-300">
      <div className="mb-6 md:mb-0">
        <Link href={createDiscussonTwitterUrl(postUrl)} rel="nofollow">
          {'Discuss on Twitter'}
        </Link>
        {` • `}
        <Link href={creatEditOnGithubUrl(fileName)}>{'View on GitHub'}</Link>
      </div>
      <div className="flex items-center">
        <TwitterShareButton
          url={postUrl}
          title={title}
          via={siteMetadata.socialAccount.twitter}
          className="flex items-center !p-1.5 mr-2 !bg-[#1da1f2] rounded overflow-hidden"
        >
          <TwitterIcon className="w-5 h-5" fill="#fff" />
          <span className="ml-2.5 mr-1.5 font-extrabold text-white">Tweet</span>
        </TwitterShareButton>
        <FacebookShareButton
          url={postUrl}
          quote={title}
          className="flex items-center !p-1.5 mr-2 !bg-[#1877f2] rounded overflow-hidden"
        >
          <FacebookIcon className="w-5 h-5" fill="#fff" />
          <span className="ml-2.5 mr-1.5 font-extrabold text-white">Share</span>
        </FacebookShareButton>
      </div>
    </div>
  )
}
