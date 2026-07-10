import { getBooks, getMovies, type Movie } from '~/lib/media'

function sortMovies(a: Movie, b: Movie): number {
  if (b.yourRating === a.yourRating) return b.imdbRating - a.imdbRating
  return b.yourRating - a.yourRating
}

export async function GET() {
  const [books, movies] = await Promise.all([getBooks(), getMovies()])
  return Response.json(
    {
      books: books.sort((a, b) => b.userRating - a.userRating),
      movies: movies.sort(sortMovies),
    },
    {
      headers: {
        'cache-control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  )
}
