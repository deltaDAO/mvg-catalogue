import React, { ReactElement } from 'react'
import { useSiteMetadata } from '../../hooks/UseSiteMetadata'
import styles from './index.module.css'
import Searchform from './Searchform'

export default function HomePage(): ReactElement {
  const { title, description } = useSiteMetadata().site

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>

        <p className={styles.description}>{description}</p>

        <Searchform />
      </div>
    </>
  )
}
