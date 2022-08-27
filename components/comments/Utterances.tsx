import { useTheme } from 'next-themes'
import { useState } from 'react'
import { UTTERANCES_COMMENTs_ID } from '~/constant'
import type { UtterancesProps } from '~/types'

let Utterances = ({ utterancesConfig }: UtterancesProps) => {
  let [loaded, setLoaded] = useState(false)
  let { theme, resolvedTheme } = useTheme()

  let { lightTheme, darkTheme } = utterancesConfig
  let isDark = theme === 'dark' || resolvedTheme === 'dark'
  let uttrTheme = isDark ? darkTheme : lightTheme

  function handleLoadComments() {
    setLoaded(true)
    let script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.setAttribute('repo', utterancesConfig.repo)
    script.setAttribute('issue-term', utterancesConfig.issueTerm)
    script.setAttribute('label', utterancesConfig.label)
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
    <div className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300">
      {!loaded && <button onClick={handleLoadComments}>Load Comments</button>}
      <div className="utterances-frame relative" id={UTTERANCES_COMMENTs_ID} />
    </div>
  )
}

export default Utterances
