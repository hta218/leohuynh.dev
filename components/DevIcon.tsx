import React from '~/icons/react.svg'
import Git from '~/icons/git.svg'
import Javascript from '~/icons/javascript.svg'
import Typescript from '~/icons/typescript.svg'
import Node from '~/icons/nodejs.svg'
import Bash from '~/icons/bash.svg'
import Liquid from '~/icons/liquid.svg'
import Markdown from '~/icons/markdown.svg'

export let DevIconsMap = {
  React,
  Git,
  Javascript,
  Typescript,
  Node,
  Bash,
  Liquid,
  Markdown,
}

export function DevIcon({ type }: { type: keyof typeof DevIconsMap }) {
  let Icon = DevIconsMap[type]
  if (!Icon) return <div>Missing icon</div>

  return <Icon className="h-16 w-16 lg:h-14 lg:w-14 xl:h-24 xl:w-24" fill="currentColor" />
}
