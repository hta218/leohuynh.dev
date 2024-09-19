import Image from 'next/image'
import { Button } from '~/components/button'
import Container from '~/components/Container'
import Link from '~/components/Link'
import Twemoji from '~/components/Twemoji'

export default function NotFound() {
  return (
    <Container className="pt-4 lg:pt-12">
      <div className="flex flex-col items-center justify-center py-6">
        <Image
          src="/static/images/404.png"
          alt="404"
          width={500}
          height={500}
          className="max-w-[80vw]"
        />
        <div className="space-x-2 pt-8 md:space-y-5 md:pt-12 xl:pt-16">
          <div className="max-w-md text-center">
            <p className="mb-4 text-2xl font-bold leading-normal md:text-2xl">
              Hmm... it looks like you're lost.
              <Twemoji emoji={'face-with-monocle'} />
            </p>
            <p className="mb-8">
              But don't worry, you can find plenty of other things on my homepage.
            </p>
            <Link href="/">
              <Button>Back to homepage</Button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  )
}
