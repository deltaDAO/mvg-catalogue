import { ReactElement } from 'react'
import { useSiteMetadata } from '../../hooks/UseSiteMetadata'
import styles from './Menu.module.css'
import Link from 'next/link'

export default function Menu(): ReactElement {
  const { site } = useSiteMetadata()
  const { menu } = site

  return (
    <nav className={styles.menu}>
      <ul>
        {menu.map((item, i) => (
          <li key={`${item.label}-${i}`} className={styles.link}>
            <Link href={item.target}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
