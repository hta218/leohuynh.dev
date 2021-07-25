import NextImage from 'next/image'

// eslint-disable-next-line jsx-a11y/alt-text
const Image = ({ ...rest }) => (
  <div className="flex justify-center">
    <NextImage {...rest} />
  </div>
)

export default Image
