import { ReactElement, ReactNode } from 'react'
import styles from './HomeSection.module.css'

export default function HomeSection({
  title,
  children
}: {
  title: string
  children: ReactNode
}): ReactElement {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      {children}
    </div>
  )
}
