import React, { ReactElement } from 'react'
import { MetadataMain } from '../../@types/Metadata'
import { format } from 'date-fns'
import Dotdotdot from 'react-dotdotdot'
import styles from './Asset.module.css'

export default function Asset({
  asset
}: {
  asset: MetadataMain
}): ReactElement {
  return (
    <div className={styles.asset}>
      <Dotdotdot className={styles.name} clamp={1}>
        {asset.name}
      </Dotdotdot>

      <div className={styles.info}>
        <span className={styles.date}>
          {format(new Date(asset.datePublished), 'dd/MM/yy, hh:mm z')}
        </span>
        <span className={styles.type}>{asset.type}</span>
      </div>
    </div>
  )
}
