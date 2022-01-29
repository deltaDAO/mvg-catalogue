import React, { ReactElement } from 'react'
import { MetadataMain } from '../../@types/Metadata'
import { format } from 'date-fns'
import Dotdotdot from 'react-dotdotdot'
import styles from './Asset.module.css'
import Link from 'next/link'
import { portalUri } from '../../../app.config'

export default function Asset({
  asset
}: {
  asset: MetadataMain
}): ReactElement {
  return (
    <Link href={`${portalUri}/asset/${asset._id}`}>
      <a className={styles.asset} target="blank" rel="noopener noreferrer">
        <Dotdotdot className={styles.name} clamp={1}>
          {asset.name}
        </Dotdotdot>

        <div className={styles.info}>
          <span className={styles.date}>
            {format(new Date(asset.datePublished), 'dd/MM/yy, hh:mm z')}
          </span>
          <span className={styles.type}>{asset.type}</span>
        </div>
      </a>
    </Link>
  )
}
