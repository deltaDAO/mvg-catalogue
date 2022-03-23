import { ReactElement } from 'react'
import { useSiteMetadata } from '../../hooks/UseSiteMetadata'
import Searchform from '../Search/Searchform'
import Assettypes from './Assettypes'
import Categories from './Categories'
import styles from './index.module.css'
import RecentlyPublishedAssets from './RecentlyPublished'

export default function HomePage(): ReactElement {
  const { title, description } = useSiteMetadata().site

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
      <Searchform />
      <Assettypes />
      <Categories />
      <RecentlyPublishedAssets />
    </div>
  )
}
