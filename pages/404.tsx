import Image from 'next/image'
import { Link } from '~/components/Link'
import { Twemoji } from '~/components/Twemoji'

export default function FourZeroFour() {
  return (
    <div className="flex flex-col items-center justify-center pt-4 md:pt-10 xl:pt-20">
      <div>
        <Image src={'/static/images/404.png'} alt="404" width={500} height={500} />
      </div>
      <div className="space-x-2 pt-8 md:space-y-5 md:pt-12 xl:pt-16">
        <div className="max-w-md text-center">
          <p className="mb-4 text-xl font-bold leading-normal md:text-2xl">
            Hmm.. it seems that you're lost <Twemoji emoji={'face-with-monocle'} />
          </p>
          <p className="mb-8">
            But don't worry, you can find plenty of other things on my homepage.
          </p>
          <Link href="/">
            <button className="focus:shadow-outline-blue inline rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium leading-5 text-white shadow transition-colors duration-150 hover:bg-blue-700 focus:outline-none dark:hover:bg-blue-500">
              Back to homepage
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
