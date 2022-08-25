import kebabCase from '~libs/utils/kebabCase'

const Twemoji = ({
  emoji,
  size = 'twa-lg',
  className,
}: {
  emoji: string
  size?: string
  className?: string
}) => {
  let cls = `inline-block twa ${size} twa-${kebabCase(emoji)} ${className || ''}`
  return <i className={cls.trim()} />
}

export default Twemoji
