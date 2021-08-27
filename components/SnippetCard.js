import DevIcon from './dev-icons'
import Link from './Link'

const SnippetCard = ({ snippet }) => {
  const { type, title, summary, slug } = snippet
  return (
    <Link href={`/snippets/${slug}`}>
      <div className="flex rounded border border-gray-300 hover:border-gray-500 cursor-pointer">
        <div className="p-4">
          <DevIcon type={type} />
        </div>
        <div className="p-4 md:p-4">
          <h3 className="text-2xl font-bold leading-8 tracking-tight">{title}</h3>
          <p className="mt-2 text-gray-700 dark:text-gray-400">{summary}</p>
        </div>
      </div>
    </Link>
  )
}

export default SnippetCard
