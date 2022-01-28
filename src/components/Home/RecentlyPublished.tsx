import Link from 'next/link'
import { ReactElement, useEffect, useState } from 'react'
import { FilterByTypeOptions } from '../../models/SortAndFilters'
import { getRecentlyPublishedAssets } from '../../util/aquarius'
import Assetlist from '../Assetlist'
import Loader from '../atoms/Loader'
import { filterAssetMetadata, SearchResults } from '../Search'

export default function RecentlyPublishedAssets({
  size = 10
}: {
  size?: number
}): ReactElement {
  const [recentAssets, setRecentAssets] = useState<SearchResults>()

  useEffect(() => {
    const loadPopularCategories = async () => {
      const data = await getRecentlyPublishedAssets(size)
      setRecentAssets(filterAssetMetadata(data))
      console.log(data)
    }
    loadPopularCategories()
  }, [size])

  return (
    <div>
      {recentAssets?.metadata ? (
        <>
          <Assetlist assets={recentAssets.metadata} />
          <Link
            href={{
              pathname: '/search',
              query: { type: FilterByTypeOptions.All }
            }}
          >
            <a>
              <h4>Browse all services</h4>
            </a>
          </Link>
        </>
      ) : (
        <Loader style="spinner" />
      )}
    </div>
  )
}
