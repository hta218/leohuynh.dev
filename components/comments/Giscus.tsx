import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { GISCUS_COMMENTS_ID } from '~/constant'
import { siteMetadata } from '~/data'

function Giscus() {
  let { theme, resolvedTheme } = useTheme()
  let { giscusConfig } = siteMetadata.comment
  let { themeURL, darkTheme, lightTheme } = giscusConfig

  useEffect(() => {
    let isDark = theme === 'dark' || resolvedTheme === 'dark'
    let giscusTheme = isDark ? darkTheme : lightTheme
    if (themeURL) giscusTheme = themeURL

    let script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', giscusConfig.repo)
    script.setAttribute('data-repo-id', giscusConfig.repositoryId)
    script.setAttribute('data-category', giscusConfig.category)
    script.setAttribute('data-category-id', giscusConfig.categoryId)
    script.setAttribute('data-mapping', giscusConfig.mapping)
    script.setAttribute('data-reactions-enabled', giscusConfig.reactions)
    script.setAttribute('data-emit-metadata', giscusConfig.metadata)
    script.setAttribute('data-theme', giscusTheme)
    script.setAttribute('crossOrigin', 'anonymous')
    script.async = true

    let commentsNode = document.getElementById(GISCUS_COMMENTS_ID)
    if (commentsNode) commentsNode.appendChild(script)

    return () => {
      let comments = document.getElementById(GISCUS_COMMENTS_ID)
      if (comments) comments.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, resolvedTheme])

  return (
    <div className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300">
      <div className="giscus" id={GISCUS_COMMENTS_ID} />
    </div>
  )
}

export default Giscus
