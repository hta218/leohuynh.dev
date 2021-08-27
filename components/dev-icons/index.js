import React from './react.svg'
import Git from './git.svg'

// Icons taken from: https://simpleicons.org/

const icons = {
  react: React,
  git: Git,
}

const DevIcon = ({ type }) => {
  const DevSvg = icons[type]

  return <DevSvg className="h-10 2-10 lg:h-20 lg:w-20" />
}

export default DevIcon
