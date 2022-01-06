import React, { ReactElement } from 'react'
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
          <li key={i}>
            <Link href={item.target}>
              <a className={styles.link}>{item.label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
