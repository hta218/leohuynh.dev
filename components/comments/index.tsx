import dynamic from 'next/dynamic'
import { siteMetadata } from '~/data'

let UtterancesComponent = dynamic(() => import('components/comments/Utterances'), { ssr: false })
let GiscusComponent = dynamic(() => import('components/comments/Giscus'), { ssr: false })
let DisqusComponent = dynamic(() => import('components/comments/Disqus'), { ssr: false })

export function Comments({ frontMatter }) {
  let { provider } = siteMetadata.comment

  switch (provider) {
    case 'giscus':
      return <GiscusComponent />
    case 'utterances':
      return <UtterancesComponent />
    case 'disqus':
      return <DisqusComponent identifier={frontMatter.slug} />
    default:
      return <div>Unknown comment provider: ${provider}</div>
  }
}
