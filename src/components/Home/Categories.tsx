import React, { ReactElement, useEffect, useState } from 'react'
import { getPopularTags } from '../../util/aquarius'
import { AggregationBucket, Aggregations } from '../../@types/Aggregates'
import styles from './Categories.module.css'
import Link from 'next/link'
import Box from '../atoms/Box'

export default function Categories({
  size = 6
}: {
  size?: number
}): ReactElement {
  const [categories, setCategories] = useState<AggregationBucket[]>()

  useEffect(() => {
    const loadPopularCategories = async () => {
      const data = await getPopularTags(size)
      setCategories(data.aggregations?.popular_tags?.buckets)
    }
    loadPopularCategories()
  }, [size])

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Popular Categories</h3>
      <div className={styles.categories}>
        {categories?.map((category, i) => (
          <Link
            key={i}
            href={{ pathname: '/search', query: { tags: category.key } }}
          >
            <a>
              <Box className={styles.box}>{category.key}</Box>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}
