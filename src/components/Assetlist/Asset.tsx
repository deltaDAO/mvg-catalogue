import { ReactElement, useEffect, useState } from 'react'
import { DDO, MetadataMain } from '@oceanprotocol/lib'
import { format } from 'date-fns'
import Dotdotdot from 'react-dotdotdot'
import styles from './Asset.module.css'
import Link from 'next/link'
import { portalUri } from '../../../app.config'
import Price from '../Price'
import { BestPrice } from '../../models/BestPrice'

export default function Asset({
  ddo,
  price
}: {
  ddo: DDO
  price: BestPrice
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
        <Dotdotdot className={styles.name} clamp={1}>
          {metadata?.name}
        </Dotdotdot>

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
