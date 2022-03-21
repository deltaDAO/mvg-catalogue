import React, { ReactElement } from 'react'
import styles from './index.module.css'
import Loader from '../atoms/Loader'
import PriceUnit from './PriceUnit'
import { BestPrice } from '../../models/BestPrice'

export default function Price({
  price,
  className,
  small,
  conversion
}: {
  price: BestPrice
  className?: string
  small?: boolean
  conversion?: boolean
}): ReactElement {
  return price?.value || price?.type === 'free' ? (
    <PriceUnit
      price={`${price.value}`}
      symbol={price.oceanSymbol}
      className={className}
      small={small}
      conversion={conversion}
      type={price.type}
    />
  ) : !price || price?.type === '' ? (
    <div className={styles.empty}>No price set</div>
  ) : (
    <Loader message="Retrieving price..." />
  )
}
