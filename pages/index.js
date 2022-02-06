import Link from '@/components/Link'
import ProfileCard from '@/components/ProfileCard'
import { PageSeo } from '@/components/SEO'
import Tag from '@/components/Tag'
import Twemoji from '@/components/Twemoji.js'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'

const MAX_DISPLAY = 5

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')

  return { props: { posts } }
}

export default function Home({ posts }) {
  const headingColorClass = 'bg-gradient-to-r from-sky-400 to-cyan-300'
  return (
    <>
      <PageSeo title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700 mt-16">
        <div className="my-4 pt-6 pb-8 space-y-2 md:space-y-5 xl:grid xl:grid-cols-3">
          <div className="xl:col-span-2 pr-8">
            <h1
              className={`mb-8 text-4xl font-extrabold tracking-tight text-transparent bg-clip-text ${headingColorClass} sm:text-4xl sm:leading-10 md:text-6xl md:leading-[72px]`}
            >
              Hey there <i className="twa twa-waving-hand"></i>
            </h1>

            <div className="text-lg leading-8 text-gray-600 dark:text-gray-400">
              I'm <span className="font-medium">Tuan Anh</span> (aka Leo) - a{' '}
              <span className="font-medium">Software Engineer</span> in{' '}
              <span className="align-middle">
                <Twemoji emoji="flag-vietnam" />
              </span>
              <p className="mt-4 mb-8">
                I started my coding journey in late 2016 with C/C++/Java in college.
                <br />I learned{' '}
                <a
                  className="underline"
                  href="https://github.com/hta218/Travel_Egypt"
                  target="_blank"
                  rel="noreferrer"
                >
                  Python
                </a>{' '}
                and got my first job as a coding mentor for newbies in 2017.
                <br />
                I'm in love with JS ecosystem, Web dev, and eCommerce.
                <br />
                I'm writing this blog to note down and share what I've learned as a SE.
              </p>
              <div className="flex flex-col">
                <Link href="/projects" className="hover:underline">
                  <Twemoji emoji="hammer-and-wrench" /> What have I built?
                </Link>
                <Link href="/projects" className="hover:underline">
                  <Twemoji emoji="face-with-monocle" /> More about me and myself.
                </Link>
                <Link href="/projects" className="hover:underline">
                  <Twemoji emoji="briefcase" /> My career.
                </Link>
                <Link href="/blog" className="hover:underline">
                  <Twemoji emoji="memo" /> My writings.
                </Link>
                <Link href="/snippets" className="hover:underline">
                  <Twemoji emoji="dna" /> Useful snippets collected by me.
                </Link>
              </div>
              <p className="my-8">
                Happy reading <Twemoji emoji="clinking-beer-mugs" />
              </p>
            </div>
          </div>
          <div className="hidden xl:block">
            <ProfileCard />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
            const { slug, date, title, summary, tags } = frontMatter
            return (
              <li key={slug} className="py-12">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-3xl font-bold mb-1 tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose text-gray-500 max-w-none dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base font-medium leading-6">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
        {posts.length > MAX_DISPLAY && (
          <div className="flex justify-end text-base font-medium leading-6">
            <Link
              href="/blog"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="all posts"
            >
              All Posts &rarr;
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
