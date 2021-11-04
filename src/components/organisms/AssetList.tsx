import React, { useEffect, useState } from 'react'
import Pagination from '../molecules/Pagination'
import styles from './AssetList.module.css'
import { DDO } from '@oceanprotocol/lib'
import { getAssetsBestPrices, AssetListPrices } from '../../utils/subgraph'
import Loader from '../atoms/Loader'
import CatalogTable from '../molecules/CatalogTable'
import { useUserPreferences } from '../../providers/UserPreferences'
import { useIsMounted } from '../../hooks/useIsMounted'

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

declare type AssetListProps = {
  assets: DDO[]
  showPagination: boolean
  page?: number
  totalPages?: number
  isLoading?: boolean
  onPageChange?: React.Dispatch<React.SetStateAction<number>>
}

const AssetList: React.FC<AssetListProps> = ({
  assets,
  showPagination,
  page,
  totalPages,
  isLoading,
  onPageChange
}) => {
  const { chainIds } = useUserPreferences()
  const [assetsWithPrices, setAssetWithPrices] = useState<AssetListPrices[]>()
  const [loading, setLoading] = useState<boolean>(true)
  const isMounted = useIsMounted()
  useEffect(() => {
    if (!assets) return
    isLoading && setLoading(true)

    async function fetchPrices() {
      const asset = await getAssetsBestPrices(assets)
      if (!isMounted()) return
      setAssetWithPrices(asset)
      setLoading(false)
    }

    fetchPrices()
  }, [assets])

  // This changes the page field inside the query
  function handlePageChange(selected: number) {
    onPageChange(selected + 1)
  }

  return assetsWithPrices && !loading ? (
    <>
      <div>
        {assetsWithPrices.length > 0 ? (
          <CatalogTable assetsWithPrices={assetsWithPrices} />
        ) : (
          <div className={styles.empty}>
            {chainIds.length === 0
              ? 'No network selected.'
              : 'No results found.'}
          </div>
        )}
      </div>

      {showPagination && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onChangePage={handlePageChange}
        />
      )}
    </>
  ) : (
    <LoaderArea />
  )
}

export default AssetList
