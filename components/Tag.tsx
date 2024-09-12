import Link from 'next/link'
import { slug } from 'github-slugger'

function Tag({ text }: { text: string }) {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="mr-3 rounded-lg bg-slate-100 px-2 py-0.5 text-sm font-semibold text-gray-600 hover:text-gray-800"
    >
      #{text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
