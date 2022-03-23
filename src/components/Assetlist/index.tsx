import { ReactElement } from 'react'
import { MetadataMain } from '../../@types/Metadata'
import Asset from './Asset'
import styles from './index.module.css'

export default function Assetlist({
  assets
}: {
  assets: MetadataMain[] | undefined
}): ReactElement {
  return (
    <div className={styles.list}>
      {assets?.map((asset) => (
        <Asset asset={asset} key={asset._id} />
      ))}
    </div>
  )
}
