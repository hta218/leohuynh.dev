'use client'

import { Facebook } from 'lucide-react'
import { FacebookShareButton, TwitterShareButton } from 'react-share'
import XIcon from '~/icons/x.svg'
import Link from './Link'
import siteMetadata from '~/data/siteMetadata'

type SocialButtonsProps = {
  postUrl: string
  title: string
  filePath: string
}

export function SocialShareButtons({ postUrl, title, filePath }: SocialButtonsProps) {
  let CREATE_DISCUS_ON_TWITTER = process.env.NEXT_PUBLIC_CREATE_DISCUS_ON_TWITTER
  let CREATE_DISCUS_ON_GITHUB = process.env.NEXT_PUBLIC_CREATE_DISCUS_ON_GITHUB
  let SHARE_ON_TWITTER = process.env.NEXT_PUBLIC_SHARE_ON_TWITTER
  let SHARE_ON_FACEBOOK = process.env.NEXT_PUBLIC_SHARE_ON_FACEBOOK

  return (
    <div className="items-center justify-between pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300 md:flex">
      <div className="mb-6 space-x-1 md:mb-0">
        {CREATE_DISCUS_ON_TWITTER === 'TRUE' && (
          <>
            <Link
              href={`https://twitter.com/search?q=${encodeURIComponent(postUrl)}`}
              rel="nofollow"
            >
              <span className="background-underline" data-umami-event="discuss-on-x">
                Discuss on X (formerly Twitter)
              </span>
            </Link>
            <span>{` • `}</span>
          </>
        )}
        {CREATE_DISCUS_ON_GITHUB === 'TRUE' && (
          <Link href={`${siteMetadata.siteRepo}/blob/main/data/${filePath}`}>
            <span className="background-underline" data-umami-event="discuss-on-github">
              View on GitHub
            </span>
          </Link>
        )}
      </div>
      <div className="flex items-center text-white">
        {SHARE_ON_TWITTER === 'TRUE' && (
          <TwitterShareButton
            url={postUrl}
            title={title}
            via={siteMetadata.x}
            className="mr-2 flex items-center overflow-hidden rounded !bg-x !px-2.5 !py-1.5 hover:opacity-90"
          >
            <XIcon className="h-5 w-5" fill="#fff" viewBox="0 0 1200 1227" />
            <span className="ml-2.5 mr-1.5 font-extrabold text-white">Tweet</span>
          </TwitterShareButton>
        )}
        {SHARE_ON_FACEBOOK === 'TRUE' && (
          <FacebookShareButton
            url={postUrl}
            className="mr-2 flex items-center overflow-hidden rounded !bg-facebook !px-2.5 !py-1.5 hover:opacity-90"
          >
            <Facebook strokeWidth={1.5} size={20} />
            <span className="ml-2.5 mr-1.5 font-extrabold text-white">Share</span>
          </FacebookShareButton>
        )}
      </div>
    </div>
  )
}
