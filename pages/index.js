import Link from '@/components/Link'
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
  return (
    <>
      <PageSeo title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Xin chào <i className="twa twa-waving-hand"></i>
          </h1>
          <p className="text-lg leading-7 text-gray-600 dark:text-gray-400">
            Mình là <span className="font-medium">Tuấn Anh (Leo)</span> -{' '}
            <span className="font-medium">Shopify Software Engineer</span> tại{' '}
            <a
              href="https://insights.is"
              target="_blank"
              className="text-primary-400 hover:text-primary-600 dark:hover:text-primary-400"
              rel="noreferrer"
            >
              Insights Studio
            </a>
            .
            <p className="my-4">
              Mình sở hữu chiếc <Twemoji emoji="desktop computer" /> đầu tiên năm lớp 7 và đã dành
              rất nhiều thời gian cho máy tính kể từ đó! Chỉ vài năm sau mình đã thành thạo việc
              chơi AOE, CS và soạn giáo án trên MS Word cho chú <Twemoji emoji="partying-face" />
              <Twemoji emoji="partying-face" />
            </p>
            <p className="my-4">
              Mình làm quen và hứng thú với lập trình từ cuối năm 2016, từ đó đến nay mình đã làm
              việc ở vài công ty, lớn có, nhỏ có. Blog này là nơi note lại những kiến thức mà mình
              học được và những điều hay ho mình trải nghiệm khi đi làm!
            </p>
            <p className="my-4">
              Happy reading <Twemoji emoji="clinking-beer-mugs" />
            </p>
          </p>
        </div>
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
      </div>
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
    </>
  )
}
