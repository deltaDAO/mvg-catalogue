import { ReactElement, useEffect, useState } from 'react'
import { MetadataMain } from '../../@types/Metadata'
import { useIsMounted } from '../../hooks/useIsMounted'
import { AssetListPrices, getAssetsBestPrices } from '../../utils/subgraph'
import Asset from './Asset'
import styles from './index.module.css'

export default function Assetlist({
  assets
}: {
  assets: MetadataMain[] | undefined
}): ReactElement {
  const [assetsWithPrices, setAssetWithPrices] = useState<AssetListPrices[]>()
  const [loading, setLoading] = useState<boolean>(true)
  const isMounted = useIsMounted()
  useEffect(() => {
    if (!assets || assets?.length === 0) return
    // isLoading && setLoading(true)
    console.log(assets)
    const didList = assets.map((e) => e)

    async function fetchPrices() {
      const asset = await getAssetsBestPrices(assets)
      if (!isMounted()) return
      setAssetWithPrices(asset)
      setLoading(false)
    }

    fetchPrices()
  }, [assets])

  return (
    <div className={styles.list}>
      {assets?.map((asset) => (
        <Asset asset={asset} key={asset._id} />
      ))}
    </div>
  )
}
