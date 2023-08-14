import dynamic from 'next/dynamic'
import type { CommentsProps } from '~/types/components'

let Giscus = dynamic(() => import('./Giscus'), { ssr: false })
let Utterances = dynamic(() => import('./Utterances'), { ssr: false })
let Disqus = dynamic(() => import('./Disqus'), { ssr: false })

export function Comments({ frontMatter, config }: CommentsProps) {
  let { provider, giscusConfig, utterancesConfig, disqus } = config

  switch (provider) {
    case 'giscus':
      return <Giscus config={giscusConfig} />
    case 'utterances':
      return <Utterances config={utterancesConfig} />
    case 'disqus':
      return <Disqus identifier={frontMatter.slug} disqus={disqus} />
    default:
      return <div>Unknown comment provider: {provider}</div>
  }
}
