import React, { ReactElement } from 'react'
import styles from './Logo.module.css'
import GaiaXLogo from '../../../public/images/gaia-x-logo.svg'

export default function Logo(): ReactElement {
  return <GaiaXLogo className={styles.logo} />
}
