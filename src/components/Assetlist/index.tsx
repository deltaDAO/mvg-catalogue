import { ReactElement, useEffect, useState } from 'react'
import { MetadataMain } from '../../@types/Metadata'
import { AssetListPrices } from '../../@types/Subgraph'
import { useCancelToken } from '../../hooks/useCancelToken'
import { useIsMounted } from '../../hooks/useIsMounted'
import { retrieveDDOListByDIDs } from '../../utils/aquarius'
import { getAssetsBestPrices } from '../../utils/subgraph'
import Loader from '../atoms/Loader'
import Asset from './Asset'
import styles from './index.module.css'

export default function Assetlist({
  assets
}: {
  assets: MetadataMain[] | undefined
}): ReactElement {
  const [assetsWithPrices, setAssetWithPrices] = useState<AssetListPrices[]>([])
  const isMounted = useIsMounted()
  const newCancelToken = useCancelToken()

  useEffect(() => {
    if (!assets || assets?.length === 0) return
    const didList = assets.map((e) => e._id)

    async function fetchPrices() {
      const ddoList = await retrieveDDOListByDIDs(didList, newCancelToken())
      if (!ddoList) return
      const asset = await getAssetsBestPrices(ddoList)
      if (!isMounted()) return
      setAssetWithPrices(asset)
    }

    fetchPrices()
  }, [assets])

  return (
    <div className={styles.list}>
      {assetsWithPrices.length > 0 ? (
        assetsWithPrices?.map((asset) => (
          <Asset ddo={asset.ddo} price={asset.price} key={asset.ddo.id} />
        ))
      ) : (
        <Loader style="spinner" />
      )}
    </div>
  )
}
