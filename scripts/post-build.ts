import { generateRssFeed } from './rss'

async function postbuild() {
  await generateRssFeed()
}

postbuild()
