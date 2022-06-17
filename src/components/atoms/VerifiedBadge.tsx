import React, { ReactElement } from 'react'
import VerifiedPatch from '../../../public/images/patch_check.svg'
import styles from './VerifiedBadge.module.css'

export default function VerifiedBadge({
  text
}: {
  text?: string
}): ReactElement {
  return (
    <div className={styles.verifiedBadge}>
      <VerifiedPatch />
      <span>{text}</span>
    </div>
  )
}
