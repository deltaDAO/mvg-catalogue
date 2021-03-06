import { ReactElement } from 'react'
import styles from './Logo.module.css'
import GaiaXLogo from '../../../public/images/gaia-x-logo.svg'
import Link from 'next/link'

export default function Logo(): ReactElement {
  return (
    <Link href="/">
      <a>
        <GaiaXLogo className={styles.logo} />
      </a>
    </Link>
  )
}
