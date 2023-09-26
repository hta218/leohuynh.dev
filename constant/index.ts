export let BLUR_IMAGE_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcvWS1LgAGJQIpt50GkgAAAABJRU5ErkJggg=='

export let LOGO_IMAGE_PATH = '/static/images/logo.jpg'

export let GISCUS_COMMENTS_ID = 'comments-container'
export let UTTERANCES_COMMENTs_ID = 'comments-container'
export let DISQUS_COMMENTS_ID = 'disqus_thread'

export let HEADER_HEIGHT = '69px'
export let FOOTER_HEIGHT = '188px'
export let MAIN_CONTENT_MIN_HEIGHT = `calc(100vh - ${HEADER_HEIGHT} - ${FOOTER_HEIGHT})`

export let SPOTIFY_TOKEN_API = `https://accounts.spotify.com/api/token`
export let SPOTIFY_NOW_PLAYING_API = `https://api.spotify.com/v1/me/player/currently-playing`
export let SPOTIFY_TOP_TRACKS_API = `https://api.spotify.com/v1/me/top/tracks`

export let TOKEN_CLASSNAMES = {
  tag: 'text-code-red',
  'attr-name': 'text-code-yellow',
  'attr-value': 'text-code-green',
  deleted: 'text-code-red',
  inserted: 'text-code-green',
  punctuation: 'text-code-white',
  keyword: 'text-code-purple',
  string: 'text-code-green',
  function: 'text-code-blue',
  boolean: 'text-code-red',
  comment: 'text-gray-500 italic',
}

export let POSTS_PER_PAGE = 10
export let FEATURED_POSTS = 5

export let LOCALES = [
  {
    code: 'en',
    name: 'English',
    flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/us.svg',
  },
  {
    code: 'es',
    name: 'Español',
    flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/es.svg',
  },
]

export let DEFAULT_LOCALE = 'en'
