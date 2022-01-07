import Link from 'next/link'
import React, { ReactElement } from 'react'
import Box from '../atoms/Box'
import styles from './Assettypes.module.css'

const services = ['dataset', 'algorithm']

export default function Assettypes(): ReactElement {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Service Types</h3>
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
    </div>
  )
}
