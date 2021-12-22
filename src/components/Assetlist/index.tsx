import React, { ReactElement, useEffect, useState } from 'react'
import { MetadataMain } from '../../@types/Metadata'
import styles from './index.module.css'
import { format } from 'date-fns'
import Dotdotdot from 'react-dotdotdot'

export default function Assetlist({
  assets
}: {
  assets: MetadataMain[] | undefined
}): ReactElement {
  return (
    <>
      <div className={styles.list}>
        {assets?.map((asset, i) => (
          <div className={styles.asset} key={i}>
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
        ))}
      </div>
    </>
  )
}
