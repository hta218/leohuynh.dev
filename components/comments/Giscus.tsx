import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { GISCUS_COMMENTS_ID } from '~/constant'
import type { GiscusProps } from '~/types/components'

function Giscus({ config }: GiscusProps) {
  let { theme, resolvedTheme } = useTheme()
  let { themeURL, darkTheme, lightTheme } = config

  useEffect(() => {
    let isDark = theme === 'dark' || resolvedTheme === 'dark'
    let giscusTheme = isDark ? darkTheme : lightTheme
    if (themeURL) giscusTheme = themeURL

    let script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', config.repo)
    script.setAttribute('data-repo-id', config.repositoryId)
    script.setAttribute('data-category', config.category)
    script.setAttribute('data-category-id', config.categoryId)
    script.setAttribute('data-mapping', config.mapping)
    script.setAttribute('data-reactions-enabled', config.reactions)
    script.setAttribute('data-emit-metadata', config.metadata)
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
    <div className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300">
      <div className="giscus" id={GISCUS_COMMENTS_ID} />
    </div>
  )
}

export default Giscus
