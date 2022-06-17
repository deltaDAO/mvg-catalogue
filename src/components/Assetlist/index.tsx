import { Logger } from '@oceanprotocol/lib'
import { ReactElement, useEffect, useState } from 'react'
import { MetadataMain } from '../../@types/Metadata'
import { AssetListPrices } from '../../@types/Subgraph'
import { useCancelToken } from '../../hooks/useCancelToken'
import { useIsMounted } from '../../hooks/useIsMounted'
import { retrieveDDOListByDIDs } from '../../utils/aquarius'
import {
  getPublisherFromServiceSD,
  getServiceSD,
  verifyServiceSD
} from '../../utils/metadata'
import { getAssetsBestPrices } from '../../utils/subgraph'
import Loader from '../atoms/Loader'
import Asset from './Asset'
import styles from './index.module.css'

interface AssetListPricesAndAuthor extends AssetListPrices {
  verifiedAuthor?: string
}

export default function Assetlist({
  assets
}: {
  assets: MetadataMain[] | undefined
}): ReactElement {
  const [assetsWithPrices, setAssetWithPrices] = useState<AssetListPrices[]>([])
  const [assetsWithPricesAndAuthor, setAssetsWithPricesAndAuthor] = useState<
    AssetListPricesAndAuthor[]
  >([])
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
  }, [assets, isMounted, newCancelToken])

  useEffect(() => {
    if (assetsWithPrices.length === 0) return

    async function fetchVerifiedAuthor(asset: AssetListPrices) {
      try {
        const { attributes } = asset.ddo.findServiceByType('metadata')
        const serviceSD =
          attributes?.additionalInformation?.serviceSelfDescription
        if (!serviceSD) throw new Error()

        const requestBody = serviceSD?.url
          ? { body: serviceSD.url }
          : { body: serviceSD.raw, raw: true }
        if (!requestBody) throw new Error()

        const isServiceSDVerified = await verifyServiceSD(requestBody)
        if (!isServiceSDVerified) throw new Error()

        const serviceSDContent = serviceSD?.url
          ? await getServiceSD(serviceSD.url)
          : serviceSD.raw

        const verifiedAuthor = getPublisherFromServiceSD(serviceSDContent)
        if (!verifiedAuthor) throw new Error()

        return { ...asset, verifiedAuthor }
      } catch (error) {
        Logger.debug(error.message)
        return asset
      }
    }

    async function fetchAssetsWithPricesAndAuthor() {
      const promises = assetsWithPrices.map((asset) =>
        fetchVerifiedAuthor(asset)
      )
      const assetsWithPricesAndAuthor = await Promise.all(promises)
      setAssetsWithPricesAndAuthor(assetsWithPricesAndAuthor)
    }

    fetchAssetsWithPricesAndAuthor()
  }, [assetsWithPrices])

  return (
    <div className={styles.list}>
      {assetsWithPricesAndAuthor.length > 0 ? (
        assetsWithPricesAndAuthor?.map((asset) => (
          <Asset
            ddo={asset.ddo}
            price={asset.price}
            verifiedAuthor={asset?.verifiedAuthor}
            key={asset.ddo.id}
          />
        ))
      ) : (
        <Loader style="spinner" />
      )}
    </div>
  )
}
