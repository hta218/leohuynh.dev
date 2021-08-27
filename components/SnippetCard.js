import DevIcon from './dev-icons'
import Link from './Link'

const SnippetCard = ({ snippet }) => {
  const { type } = snippet
  return (
    <div className="p-4 md:w-1/2 md">
      <DevIcon type={type} size={10} />
    </div>
  )
}

export default SnippetCard
