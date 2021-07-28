import kebabCase from '@/lib/utils/kebabCase'

const Twemoji = ({ emoji, size = 'twa-lg' }) => {
  const twaClass = kebabCase(emoji)
  return <i className={`twa ${size} twa-${twaClass}`} />
}

export default Twemoji
