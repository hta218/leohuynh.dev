import Comments from '@/components/comments'
import Image from '@/components/Image'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import ScrollTop from '@/components/ScrollTop'
import SectionContainer from '@/components/SectionContainer'
import { BlogSeo } from '@/components/SEO'
import Tag from '@/components/Tag'
import Twemoji from '@/components/Twemoji.js'
import siteMetadata from '@/data/siteMetadata'
import SocialButtons from '@/components/SocialButtons'

const postDateTemplate = { year: 'numeric', month: 'short', day: 'numeric' }

export default function PostLayout({ frontMatter, authorDetails, next, prev, page, children }) {
  const {
    slug,
    fileName,
    date,
    title,
    tags,
    readingTime: { text: readingTimeText },
  } = frontMatter
  const postUrl = `${siteMetadata.siteUrl}/blog/${slug}`
  return (
    <SectionContainer>
      <BlogSeo url={postUrl} authorDetails={authorDetails} {...frontMatter} />
      <ScrollTop />
      <article>
        <div className="">
          <header className="pt-6 xl:py-16">
            <div className="space-y-4 md:space-y-2 text-center">
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="flex justify-center items-center text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date} className="flex items-center">
                      <Twemoji emoji="calendar" size="" />
                      <span className="ml-1.5">
                        {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                      </span>
                    </time>
                    <span className="mx-2">-</span>
                    <div className="flex items-center">
                      <Twemoji emoji="hourglass-not-done" size="" />
                      <span className="ml-1.5">{readingTimeText.replace('min', 'mins')}</span>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </header>
          <div
            className="pb-8 divide-y divide-gray-200 xl:divide-y-0 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6"
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <div>
              <div className="hidden xl:block py-4 xl:py-8 border-b border-gray-200 dark:border-gray-700">
                <Link
                  href={`/blog/page/${page}`}
                  className="flex text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <svg viewBox="0 -9 3 24" className="overflow-visible mr-3 w-auto h-6">
                    <path
                      d="M3 0L0 3L3 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  Back to the blog
                </Link>
              </div>
              <dl className="pt-6 pb-10 xl:pt-11">
                <dt className="sr-only">Authors</dt>
                <dd>
                  <ul className="flex justify-center space-x-8 xl:block sm:space-x-12 xl:space-x-0 xl:space-y-6">
                    {authorDetails.map((author) => (
                      <li className="flex items-center space-x-2" key={author.name}>
                        {author.avatar && (
                          <Image
                            src={author.avatar}
                            width="38px"
                            height="38px"
                            alt="avatar"
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <dl className="text-sm font-medium leading-5 whitespace-nowrap">
                          <dt className="sr-only">Name</dt>
                          <dd className="text-gray-900 dark:text-gray-100 mb-0.5">{author.name}</dd>
                          <dt className="sr-only">Twitter</dt>
                          <dd>
                            {author.github && (
                              <>
                                <Link
                                  href={author.github}
                                  className="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                                >
                                  {author.github.replace('https://github.com/', '@')}
                                </Link>
                              </>
                            )}
                          </dd>
                        </dl>
                      </li>
                    ))}
                  </ul>
                </dd>
              </dl>
            </div>
            <div className="!border-t-0 divide-y divide-gray-200 dark:divide-gray-700 xl:pb-0 xl:col-span-3 xl:row-span-2">
              <div className="pt-10 pb-8 prose prose-lg dark:prose-dark max-w-none">{children}</div>
              <SocialButtons postUrl={postUrl} title={title} fileName={fileName} />
              <Comments frontMatter={frontMatter} />
            </div>
            <footer>
              <div className="text-sm font-medium leading-5 xl:col-start-1 xl:row-start-2">
                {/* <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/blog/page/${page}`}
                    className="flex text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    <svg viewBox="0 -9 3 24" class="overflow-visible mr-3 w-auto h-6"><path d="M3 0L0 3L3 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    Back to the blog
                  </Link>
                </div> */}
                {tags && (
                  <div className="py-4">
                    {/* <h2 className="text-sm tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                      Tags
                    </h2> */}
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
                {/* {(next || prev) && (
                  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                    {prev && (
                      <div>
                        <h2 className="text-sm mb-1 tracking-wide text-gray-500 dark:text-gray-400">
                          Previous Post
                        </h2>
                        <div className="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                          <Link href={`/blog/${prev.slug}`} className="text-base">
                            {prev.title}
                          </Link>
                        </div>
                      </div>
                    )}
                    {next && (
                      <div>
                        <h2 className="text-sm tracking-wide text-gray-500 dark:text-gray-400">
                          Next Post
                        </h2>
                        <div className="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                          <Link href={`/blog/${next.slug}`} className="text-base">
                            {next.title}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )} */}
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
