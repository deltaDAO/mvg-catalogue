import { ReactElement, useEffect, useState } from 'react'
import { DDO, MetadataMain } from '@oceanprotocol/lib'
import { format } from 'date-fns'
import Dotdotdot from 'react-dotdotdot'
import styles from './Asset.module.css'
import Link from 'next/link'
import { portalUri } from '../../../app.config'
import Price from '../Price'
import { BestPrice } from '../../models/BestPrice'
import VerifiedBadge from '../atoms/VerifiedBadge'

export default function Asset({
  ddo,
  price,
  isServiceSDVerified,
  verifiedAuthor
}: {
  ddo: DDO
  price: BestPrice
  isServiceSDVerified?: boolean
  verifiedAuthor?: string
}): ReactElement {
  const [metadata, setMetadata] = useState<MetadataMain>()

  useEffect(() => {
    if (ddo) {
      const { attributes } = ddo.findServiceByType('metadata')
      setMetadata(attributes.main)
      return
    }
  }, [ddo])
  return (
    <Link href={`${portalUri}/asset/${ddo?.id}`}>
      <a className={styles.asset} target="blank" rel="noopener noreferrer">
        <div>
          <Dotdotdot className={styles.name} clamp={1}>
            {metadata?.name}
          </Dotdotdot>
          <div className={styles.author}>
            <p>{verifiedAuthor || ddo.event.from}</p>
            {isServiceSDVerified && (
              <VerifiedBadge text="Verified Self-Description" />
            )}
          </div>
        </div>
        <div className={styles.info}>
          <span className={styles.price}>
            <Price price={price} conversion />
          </span>
          <span className={styles.date}>
            {metadata?.datePublished &&
              format(new Date(metadata.datePublished), 'dd/MM/yy, hh:mm z')}
          </span>
          <span className={styles.type}>{metadata?.type}</span>
        </div>
      </a>
    </Link>
  )
}
