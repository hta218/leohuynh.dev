import React from './react.svg'
import Git from './git.svg'
import Javascript from './javascript.svg'
import Node from './nodejs.svg'
import Bash from './bash.svg'
import Liquid from './liquid.svg'
import Markdown from './markdown.svg'

const icons = {
  react: React,
  git: Git,
  javascript: Javascript,
  nodejs: Node,
  bash: Bash,
  liquid: Liquid,
  markdown: Markdown,
}

const DevIcon = ({ type }) => {
  if (!icons[type]) return 'Missing Dev Icon'

  const DevSvg = icons[type]
  return <DevSvg className="h-16 w-16 lg:h-14 lg:w-14 xl:h-24 xl:w-24" fill="currentColor" />
}

export default DevIcon
