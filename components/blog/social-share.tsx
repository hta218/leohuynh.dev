'use client'

import { Facebook } from 'lucide-react'
import { FacebookShareButton, TwitterShareButton } from 'react-share'
import { Link } from '~/components/ui/link'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { SITE_METADATA } from '~/data/site-metadata'
import XIcon from '~/icons/x.svg'

type SocialButtonsProps = {
  postUrl: string
  title: string
  filePath: string
}

export function SocialShare({ postUrl, title, filePath }: SocialButtonsProps) {
  let CREATE_DISCUS_ON_TWITTER = process.env.NEXT_PUBLIC_CREATE_DISCUS_ON_TWITTER
  let CREATE_DISCUS_ON_GITHUB = process.env.NEXT_PUBLIC_CREATE_DISCUS_ON_GITHUB
  let SHARE_ON_TWITTER = process.env.NEXT_PUBLIC_SHARE_ON_TWITTER
  let SHARE_ON_FACEBOOK = process.env.NEXT_PUBLIC_SHARE_ON_FACEBOOK

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-6 text-sm text-gray-700 dark:text-gray-300 md:flex-row md:justify-between">
      <div className="space-x-1">
        {CREATE_DISCUS_ON_TWITTER === 'TRUE' && (
          <>
            <Link
              href={`https://twitter.com/search?q=${encodeURIComponent(postUrl)}`}
              rel="nofollow"
            >
              <GrowingUnderline data-umami-event="discuss-on-x">
                Discuss on <span className="font-semibold">X</span> (
                <span className="font-semibold">Twitter</span>)
              </GrowingUnderline>
            </Link>
            <span>{` • `}</span>
          </>
        )}
        {CREATE_DISCUS_ON_GITHUB === 'TRUE' && (
          <Link href={`${SITE_METADATA.siteRepo}/blob/main/data/${filePath}`}>
            <GrowingUnderline data-umami-event="view-on-github">
              View on <span className="font-semibold">GitHub</span>
            </GrowingUnderline>
          </Link>
        )}
      </div>
      <div className="flex items-center text-white">
        {SHARE_ON_TWITTER === 'TRUE' && (
          <TwitterShareButton
            url={postUrl}
            title={title}
            via={SITE_METADATA.x}
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
