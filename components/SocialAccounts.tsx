import { siteMetadata } from '~/data/siteMetadata'
import { SocialIcon } from './SocialIcon'

export default function SocialAccounts() {
  return (
    <div className="flex space-x-4">
      <SocialIcon name="Github" href={siteMetadata.github} />
      <SocialIcon name="Twitter" href={siteMetadata.twitter} />
      <SocialIcon name="Linkedin" href={siteMetadata.linkedin} />
      <SocialIcon name="Mail" href={`mailto:${siteMetadata.email}`} />
      <SocialIcon name="Facebook" href={siteMetadata.facebook} />
      <SocialIcon name="Youtube" href={siteMetadata.youtube} />
    </div>
  )
}
