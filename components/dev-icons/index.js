import React from './react.svg'

// Icons taken from: https://simpleicons.org/

const icons = {
  react: React,
}

const DevIcon = ({ type, size = 8 }) => {
  const DevSvg = icons[type]

  return <DevSvg className={`h-${size} w-${size}`} />
}

export default DevIcon
