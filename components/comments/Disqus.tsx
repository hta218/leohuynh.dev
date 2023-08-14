import { useState } from 'react'
import { DISQUS_COMMENTS_ID } from '~/constant'
import type { DisqusProps } from '~/types/components'

function Disqus({ identifier, disqus }: DisqusProps) {
  let [loaded, setLoaded] = useState(false)

  function handleLoadComments() {
    setLoaded(true)
    // @ts-ignore
    window.disqus_config = function () {
      this.page.url = window.location.href
      this.page.identifier = identifier
    }
    // @ts-ignore
    if (window.DISQUS === undefined) {
      let { shortname } = disqus
      let script = document.createElement('script')
      script.src = `https://${shortname}.disqus.com/embed.js`
      script.setAttribute('data-timestamp', Date.now().toString())
      script.setAttribute('crossorigin', 'anonymous')
      script.async = true
      document.body.appendChild(script)
    } else {
      // @ts-ignore
      window.DISQUS.reset({ reload: true })
    }
  }

  return (
    <div className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300">
      {!loaded && <button onClick={handleLoadComments}>Load Comments</button>}
      <div className="disqus-frame" id={DISQUS_COMMENTS_ID} />
    </div>
  )
}

export default Disqus
