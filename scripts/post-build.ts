import { generateRssFeed } from './rss'
import './seed'

async function postbuild() {
  await generateRssFeed()
}

postbuild()
