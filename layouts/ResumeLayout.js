import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import { PageSeo } from '@/components/SEO'
import ScrollTop from '@/components/ScrollTop'

export default function AuthorLayout({ children, frontMatter }) {
  const {
    name,
    title,
    avatar,
    occupation,
    company,
    email,
    twitter,
    facebook,
    linkedin,
    github,
  } = frontMatter

  return (
    <>
      <PageSeo title={`Resume - ${name} - ${title}`} description={`Resume - ${name} - ${title}`} />
      <ScrollTop />
      <div className="divide-y">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Resume
          </h1>
        </div>
        <div className="items-start space-y-2 xl:space-y-0">
          {/* <div className="flex flex-col items-center pt-8 space-x-2">
            <Image
              src={avatar}
              alt="avatar"
              shouldOpenLightbox={false}
              width="192px"
              height="192px"
              className="w-48 h-48 rounded-full"
            />
            <h3 className="pt-4 pb-2 text-2xl font-bold leading-8 tracking-tight">{name}</h3>
            <div className="text-gray-500 dark:text-gray-400">{occupation}</div>
            <div className="text-gray-500 dark:text-gray-400">{company}</div>
            <div className="flex pt-6 space-x-3">
              <SocialIcon kind="github" href={github} size={7} />
              <SocialIcon kind="twitter" href={twitter} size={7} />
              <SocialIcon kind="facebook" href={facebook} size={7} />
              <SocialIcon kind="linkedin" href={linkedin} size={7} />
              <SocialIcon kind="mail" href={`mailto:${email}`} size={7} />
            </div>
          </div> */}
          <div className="pt-8 pb-8 prose prose-lg dark:prose-dark max-w-none">{children}</div>
        </div>
      </div>
    </>
  )
}
