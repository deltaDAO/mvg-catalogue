import Link from 'next/link'
import { ReactElement } from 'react'
import Box from '../atoms/Box'
import styles from './Assettypes.module.css'
import HomeSection from './HomeSection'

const services = ['dataset', 'algorithm']

export default function Assettypes(): ReactElement {
  return (
    <HomeSection title="Service Types">
      <div className={styles.services}>
        {services.map((category, i) => (
          <Link
            key={i}
            href={{ pathname: '/search', query: { type: category } }}
          >
            <a>
              <Box className={styles.box}>
                <h3>{category}</h3>
              </Box>
            </a>
          </Link>
        ))}
      </div>
    </HomeSection>
  )
}
