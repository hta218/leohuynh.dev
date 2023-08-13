import { Twemoji } from '~/components/Twemoji'
import { siteMetadata } from '~/data/siteMetadata'
import { useTranslation } from 'next-i18next'
import { Backpack, ExternalLink, Mail, MapPin } from 'lucide-react'

export function ProfileCardInfo() {
  let { t } = useTranslation('common')

  return (
    <div className="hidden py-4 xl:block xl:px-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{t('name_position')}</h3>
      <h5 className="py-2 text-gray-700 dark:text-gray-400">{t('description_position')}</h5>
      <div className="mb-2 mt-4 space-y-4">
        <div className="flex items-center text-gray-700 dark:text-gray-200">
          <Backpack strokeWidth={1} size={22} />
          <p className="px-2">
            CTO / Co.Founder @{' '}
            <a
              target="_blank"
              href="https://weaverse.io"
              rel="noreferrer"
              className="hover:underline"
            >
              Weaverse
            </a>
          </p>
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-200">
          <MapPin strokeWidth={1} size={22} />
          <p className="px-2">
            [::1]:443 - Ha Noi,
            <span className="absolute ml-1 inline-flex pt-px">
              <Twemoji emoji="flag-vietnam" />
            </span>
          </p>
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-200">
          <Mail strokeWidth={1} size={22} />
          <a className="px-2" href={`mailto:${siteMetadata.email}`}>
            {siteMetadata.email}
          </a>
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-200">
          <ExternalLink strokeWidth={1} size={22} />
          <p className="flex space-x-1.5 px-2">
            <a
              target="_blank"
              href={siteMetadata.github}
              rel="noreferrer"
              className="hover:underline"
              data-umami-event="profile-card-github"
            >
              gh/{siteMetadata.socialAccounts.github}
            </a>
            <span className="text-gray-400 dark:text-gray-500">|</span>
            <a
              target="_blank"
              href={siteMetadata.linkedin}
              rel="noreferrer"
              className="hover:underline"
              data-umami-event="profile-card-linkedin"
            >
              in/{siteMetadata.socialAccounts.linkedin}
            </a>
            <span className="text-gray-400 dark:text-gray-500">|</span>
            <a
              target="_blank"
              href={siteMetadata.twitter}
              rel="noreferrer"
              className="hover:underline"
              data-umami-event="profile-card-twitter"
            >
              x/{siteMetadata.socialAccounts.twitter}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
