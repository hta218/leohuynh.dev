import React from './react.svg'

// Icons taken from: https://simpleicons.org/

const icons = {
  react: React,
}

const DevIcon = ({ type }) => {
  const DevSvg = icons[type]

  return <DevSvg className="h-20 w-20" />
}

export default DevIcon
