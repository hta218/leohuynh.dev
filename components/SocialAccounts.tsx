import { Facebook, Github, Linkedin, Mail, Youtube } from 'lucide-react'
import { siteMetadata } from '~/data/siteMetadata'

export default function SocialAccounts() {
  return (
    <div>
      <p className="my-3">Get in touch with me via my social media accounts:</p>
      <div className="flex space-x-4 items-center">
        <a
          href={siteMetadata.github}
          target="_blank"
          className="text-sm text-dark dark:text-white"
          data-umami-event="contact-github"
          rel="noopener noreferrer"
        >
          <span className="sr-only">Github</span>
          <Github strokeWidth={1.5} />
        </a>
        <a
          href={siteMetadata.x}
          target="_blank"
          className="text-sm text-dark dark:text-white"
          data-umami-event="contact-twitter"
          rel="noopener noreferrer"
        >
          <span className="sr-only">X</span>
          <svg
            width="1200"
            height="1227"
            viewBox="0 0 1200 1227"
            className="w-5 h-5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
              fill="currentColor"
            />
          </svg>
        </a>
        <a
          href={siteMetadata.linkedin}
          target="_blank"
          className="text-sm text-dark dark:text-white"
          data-umami-event="contact-linkedin"
          rel="noopener noreferrer"
        >
          <span className="sr-only">Linkedin</span>
          <Linkedin strokeWidth={1.5} />
        </a>
        <a
          href={`mailto:${siteMetadata.email}`}
          target="_self"
          className="text-sm text-dark dark:text-white"
          data-umami-event="contact-mail"
          rel="noopener noreferrer"
        >
          <span className="sr-only">Mail</span>
          <Mail strokeWidth={1.5} />
        </a>
        <a
          href={siteMetadata.facebook}
          target="_self"
          className="text-sm text-dark dark:text-white"
          data-umami-event="contact-facebook"
          rel="noopener noreferrer"
        >
          <span className="sr-only">Facebook</span>
          <Facebook strokeWidth={1.5} />
        </a>
        <a
          href={siteMetadata.youtube}
          target="_self"
          className="text-sm text-dark dark:text-white"
          data-umami-event="contact-youtube"
          rel="noopener noreferrer"
        >
          <span className="sr-only">Youtube</span>
          <Youtube strokeWidth={1.5} />
        </a>
      </div>
    </div>
  )
}
