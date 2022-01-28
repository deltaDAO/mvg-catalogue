import Link from 'next/link'
import { ReactElement, useEffect, useState } from 'react'
import { FilterByTypeOptions } from '../../models/SortAndFilters'
import { getRecentlyPublishedAssets } from '../../util/aquarius'
import Assetlist from '../Assetlist'
import Loader from '../atoms/Loader'
import { filterAssetMetadata, SearchResults } from '../Search'
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
    <div className={styles.container}>
      <h3 className={styles.title}>Latest Services</h3>
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
              <p className={styles.browseAll}>Browse all services</p>
            </a>
          </Link>
        </>
      ) : (
        <Loader style="spinner" />
      )}
    </div>
  )
}
