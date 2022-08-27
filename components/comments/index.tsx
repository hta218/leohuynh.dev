import dynamic from 'next/dynamic'
import type { CommentsProps } from '~/types'

let UtterancesComponent = dynamic(() => import('components/comments/Utterances'), { ssr: false })
let GiscusComponent = dynamic(() => import('components/comments/Giscus'), { ssr: false })
let DisqusComponent = dynamic(() => import('components/comments/Disqus'), { ssr: false })

export function Comments({ frontMatter, config }: CommentsProps) {
  let { provider } = config

  switch (provider) {
    case 'giscus':
      return <GiscusComponent giscusConfig={config.giscusConfig} />
    case 'utterances':
      return <UtterancesComponent utterancesConfig={config.utterancesConfig} />
    case 'disqus':
      return <DisqusComponent identifier={frontMatter.slug} disqus={config.disqus} />
    default:
      return <div>Unknown comment provider: ${provider}</div>
  }
}
