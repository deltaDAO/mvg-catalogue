import React, { ReactElement } from 'react'
import VerifiedPatch from '../../../public/images/patch_check.svg'
import Cross from '../../../public/images/cross.svg'
import styles from './VerifiedBadge.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function VerifiedBadge({
  className,
  isInvalid,
  text
}: {
  className?: string
  isInvalid?: boolean
  text?: string
}): ReactElement {
  const styleClasses = cx({
    verifiedBadge: true,
    isInvalid,
    [className]: className
  })
  return (
    <div className={styleClasses}>
      {isInvalid ? <Cross /> : <VerifiedPatch />}
      <span>{text}</span>
    </div>
  )
}
