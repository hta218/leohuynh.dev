import kebabCase from '@/lib/utils/kebabCase'

const Twemoji = ({ emoji, size = 'twa-lg', className }) => {
  const twaClass = kebabCase(emoji)
  return <i className={`twa ${size} twa-${twaClass} ${className}`} />
}

export default Twemoji
