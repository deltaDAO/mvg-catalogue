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
  const [recentlyPublishedAssets, setRecentlyPublishedAssets] =
    useState<SearchResults>()

  useEffect(() => {
    const loadRecentlyPublishedAssets = async () => {
      const data = await getRecentlyPublishedAssets(size)
      setRecentlyPublishedAssets(filterAssetMetadata(data))
    }
    loadRecentlyPublishedAssets()
  }, [size])

  return (
    <HomeSection title="Latest Services">
      {recentlyPublishedAssets?.metadata ? (
        <div>
          <Assetlist assets={recentlyPublishedAssets.metadata} />
          <Link
            href={{
              pathname: '/search',
              query: { type: FilterByTypeOptions.All, page: 1 }
            }}
          >
            <p className={styles.browseAll}>Browse all services</p>
          </Link>
        </div>
      ) : (
        <Loader style="spinner" />
      )}
    </HomeSection>
  )
}
