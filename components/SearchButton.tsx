import { AlgoliaButton } from 'pliny/search/AlgoliaButton'
import { KBarButton } from 'pliny/search/KBarButton'
import siteMetadata from '@/data/siteMetadata'
import { Command } from 'lucide-react'

function SearchButton() {
  let { search } = siteMetadata
  if (search && ['kbar', 'algolia'].includes(search.provider)) {
    let SearchButton = search.provider === 'algolia' ? AlgoliaButton : KBarButton

    return (
      <SearchButton
        aria-label="Search"
        className="rounded p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <Command size={20} strokeWidth={1.5} />
      </SearchButton>
    )
  }
}

export default SearchButton
