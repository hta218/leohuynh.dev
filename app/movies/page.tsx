import { genPageMetadata } from '~/app/seo'
import { Container } from '~/components/ui/container'
import { GrowingUnderline } from '~/components/ui/growing-underline'
import { Link } from '~/components/ui/link'
import { PageHeader } from '~/components/ui/page-header'
import { SITE_METADATA } from '~/data/site-metadata'

export let metadata = genPageMetadata({ title: 'My movies list' })

export default async function BooksPage() {
  return (
    <Container className="pt-4 lg:pt-12">
      <PageHeader
        title="Movies"
        description={
          <>
            <p>
              This is where I log all the movies and shows I’ve watched. I’m a huge fan of Tom Hanks
              and Christopher Nolan, so expect to see a lot of them in the top spots! Anything I’ve
              rated 10 stars is something I absolutely love and have probably rewatched more times
              than I can count—highly recommended. Take a look and maybe find your next favorite
              film!
            </p>
            <p className="mt-3 italic">
              *Data is exported from{' '}
              <Link href={SITE_METADATA.imdbRatingsList} className="font-medium">
                <GrowingUnderline data-umami-event="goodreads-feed">
                  my IMDB ratings list
                </GrowingUnderline>
              </Link>
              , with extra details pulled in from the{' '}
              <Link href="https://www.omdbapi.com/" className="font-medium">
                <GrowingUnderline data-umami-event="goodreads-feed">OMDB API</GrowingUnderline>
              </Link>{' '}
              for a more complete look at each movie.
            </p>
          </>
        }
        className="border-b border-gray-200 dark:border-gray-700"
      />
      <div className="py-5 md:py-10">Movies route</div>
    </Container>
  )
}
