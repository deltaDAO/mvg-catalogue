import React, { ReactElement } from 'react'
import styles from './Loader.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function Loader({
  style,
  small,
  className
}: {
  style: 'spinner' | 'dots'
  small?: boolean
  className?: string
}): ReactElement {
  return (
    <div className={cx(style, { small: small }, className)}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
