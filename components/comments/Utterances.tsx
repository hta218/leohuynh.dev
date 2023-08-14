import { useTheme } from 'next-themes'
import { useState } from 'react'
import { UTTERANCES_COMMENTs_ID } from '~/constant'
import type { UtterancesProps } from '~/types/components'

let Utterances = ({ config }: UtterancesProps) => {
  let [loaded, setLoaded] = useState(false)
  let { theme, resolvedTheme } = useTheme()

  let { lightTheme, darkTheme } = config
  let isDark = theme === 'dark' || resolvedTheme === 'dark'
  let uttrTheme = isDark ? darkTheme : lightTheme

  function handleLoadComments() {
    setLoaded(true)
    let script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.setAttribute('repo', config.repo)
    script.setAttribute('issue-term', config.issueTerm)
    script.setAttribute('label', config.label)
    script.setAttribute('theme', uttrTheme)
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    let commentsNode = document.getElementById(UTTERANCES_COMMENTs_ID)
    if (commentsNode) commentsNode.appendChild(script)

    return () => {
      let commentsNode = document.getElementById(UTTERANCES_COMMENTs_ID)
      if (commentsNode) commentsNode.innerHTML = ''
    }
  }

  // Added `relative` to fix a weird bug with `utterances-frame` position
  return (
    <div className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300">
      {!loaded && <button onClick={handleLoadComments}>Load Comments</button>}
      <div className="utterances-frame relative" id={UTTERANCES_COMMENTs_ID} />
    </div>
  )
}

export default Utterances
