import Link from 'next/link'
import { ReactElement, useEffect, useState } from 'react'
import { FilterByTypeOptions } from '../../models/SortAndFilters'
import { getRecentlyPublishedAssets } from '../../util/aquarius'
import Assetlist from '../Assetlist'
import Loader from '../atoms/Loader'
import { filterAssetMetadata, SearchResults } from '../Search'
import HomeSection from './HomeSection'
import styles from './RecentlyPublished.module.css'

export default function RecentlyPublished({
  size = 10
}: {
  size?: number
}): ReactElement {
  const [recentAssets, setRecentAssets] = useState<SearchResults>()

  useEffect(() => {
    const loadPopularCategories = async () => {
      const data = await getRecentlyPublishedAssets(size)
      setRecentAssets(filterAssetMetadata(data))
    }
    loadPopularCategories()
  }, [size])

  return (
    <HomeSection title="Latest Services">
      {recentAssets?.metadata ? (
        <div>
          <Assetlist assets={recentAssets.metadata} />
          <Link
            href={{
              pathname: '/search',
              query: { type: FilterByTypeOptions.All, page: 1 }
            }}
          >
            <a>
              <p className={styles.browseAll}>Browse all services</p>
            </a>
          </Link>
        </div>
      ) : (
        <Loader style="spinner" />
      )}
    </HomeSection>
  )
}
