import kebabCase from '@/lib/utils/kebabCase'

const Twemoji = ({ emoji }) => {
  const twaClass = kebabCase(emoji)
  return <i className={`twa twa-lg twa-${twaClass}`} />
}

export default Twemoji
