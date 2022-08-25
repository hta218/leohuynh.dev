import siteMetadata from 'data/siteMetadata'

const formatDate = (date) => {
  const now = new Date(date).toLocaleDateString(siteMetadata.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return now
}

export default formatDate
