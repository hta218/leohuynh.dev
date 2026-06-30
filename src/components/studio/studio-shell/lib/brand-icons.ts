import AstroIcon from '@icons/astro.svg?raw'
import GoodreadsIcon from '@icons/goodreads.svg?raw'
import ImdbIcon from '@icons/imdb.svg?raw'
import MarkdownIcon from '@icons/markdown.svg?raw'
import UmamiIcon from '@icons/umami.svg?raw'
import type { BrandIconName } from './types'

export const BRAND_ICONS: Record<BrandIconName, string> = {
  astro: AstroIcon,
  goodreads: GoodreadsIcon,
  imdb: ImdbIcon,
  markdown: MarkdownIcon,
  umami: UmamiIcon,
}
