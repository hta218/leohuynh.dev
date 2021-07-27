import NextImage from 'next/image'

// eslint-disable-next-line jsx-a11y/alt-text
const Image = ({ ...rest }) => {
  let blurData = {
    placeholder: 'blur',
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNcvWS1LgAGJQIpt50GkgAAAABJRU5ErkJggg==',
  }
  if (rest.src === '/static/images/logo.jpg') blurData = {}

  return (
    <div className="flex justify-center">
      <NextImage {...rest} {...blurData} />
    </div>
  )
}

export default Image
