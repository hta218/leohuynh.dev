import { rss } from './rss'
import './seed'

async function postbuild() {
  await rss()
}

postbuild()
