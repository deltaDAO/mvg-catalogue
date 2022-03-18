import { ReactElement, useEffect, useState } from 'react'
import { MetadataMain } from '../../@types/Metadata'
import { useCancelToken } from '../../hooks/useCancelToken'
import { useIsMounted } from '../../hooks/useIsMounted'
import { retrieveDDOListByDIDs } from '../../utils/aquarius'
import { AssetListPrices, getAssetsBestPrices } from '../../utils/subgraph'
import Asset from './Asset'
import styles from './index.module.css'

export default function Assetlist({
  assets
}: {
  assets: MetadataMain[] | undefined
}): ReactElement {
  const [assetsWithPrices, setAssetWithPrices] = useState<AssetListPrices[]>()
  const isMounted = useIsMounted()
  const newCancelToken = useCancelToken()

  useEffect(() => {
    if (!assets || assets?.length === 0) return
    const didList = assets.map((e) => e._id)

    async function fetchPrices() {
      const ddoList = await retrieveDDOListByDIDs(didList, newCancelToken())
      retrieveDDOListByDIDs(didList, newCancelToken()).then((data) =>
        console.log(data)
      )

      const asset = await getAssetsBestPrices(ddoList)
      if (!isMounted()) return
      setAssetWithPrices(asset)
    }

    fetchPrices()
  }, [assets])

  useEffect(() => {
    console.log(assetsWithPrices)
  }, [assetsWithPrices])

  return (
    <div className={styles.list}>
      {assets?.map((asset) => (
        <Asset asset={asset} key={asset._id} />
      ))}
    </div>
  )
}
