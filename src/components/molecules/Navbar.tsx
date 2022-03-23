import { ReactElement } from 'react'
import Logo from '../atoms/Logo'
import Menu from '../atoms/Menu'
import styles from './Navbar.module.css'

export default function Navbar(): ReactElement {
  return (
    <div className={styles.navbar}>
      <Logo />
      <Menu />
    </div>
  )
}
