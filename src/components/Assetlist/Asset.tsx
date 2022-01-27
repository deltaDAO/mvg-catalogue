import React, { ReactElement } from 'react'
import { MetadataMain } from '../../@types/Metadata'
import { format } from 'date-fns'
import Dotdotdot from 'react-dotdotdot'
import styles from './Asset.module.css'
import Link from 'next/link'

export default function Asset({
  asset
}: {
  asset: MetadataMain
}): ReactElement {
  return (
    // TODO: replace link with correct DID
    <Link
      href={`https://portal.minimal-gaia-x.eu/asset/did:op:87152E582e3B05Cc6940E9763b9e0c22eA812448`}
    >
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
