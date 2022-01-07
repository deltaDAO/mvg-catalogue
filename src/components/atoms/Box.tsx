import { ReactElement, ReactNode } from 'react'
import styles from './Box.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function Box({
  children,
  className
}: {
  children: ReactNode
  className?: string
}): ReactElement {
  const styleClasses = cx({
    container: true,
    [className as string]: className
  })

  return <div className={styleClasses}>{children}</div>
}
