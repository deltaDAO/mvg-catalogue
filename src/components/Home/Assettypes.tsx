import Link from 'next/link'
import React, { ReactElement } from 'react'
import styles from './Assettypes.module.css'

export default function Assettypes(): ReactElement {
  return (
    <div>
      <Link href={{ pathname: '/search', query: { type: 'dataset' } }}>
        Datasets
      </Link>

      <Link href={{ pathname: '/search', query: { type: 'algorithm' } }}>
        Algorithms
      </Link>
    </div>
  )
}
