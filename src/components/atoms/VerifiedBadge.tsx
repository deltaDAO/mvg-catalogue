import React, { ReactElement } from 'react'
import VerifiedPatch from '../../../public/images/patch_check.svg'
import Cross from '../../../public/images/cross.svg'
import Info from '../../../public/images/info.svg'
import styles from './VerifiedBadge.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function VerifiedBadge({
  className,
  isInvalid,
  isUnavailable,
  text
}: {
  className?: string
  isInvalid?: boolean
  isUnavailable?: boolean
  text?: string
}): ReactElement {
  const styleClasses = cx({
    verifiedBadge: true,
    isInvalid,
    isUnavailable,
    [className]: className
  })
  return (
    <div className={styleClasses}>
      {isInvalid ? <Cross /> : isUnavailable ? <Info /> : <VerifiedPatch />}
      <span>{text}</span>
    </div>
  )
}
