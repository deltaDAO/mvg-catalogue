import React, { ReactElement, useEffect, useState } from 'react'
import { getPopularTags } from '../../util/aquarius'
import { AggregationBucket } from '../../@types/Aggregates'
import styles from './Categories.module.css'
import Link from 'next/link'
import Box from '../atoms/Box'
import HomeSection from './HomeSection'

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
    <HomeSection title="Popular Categories">
      <div className={styles.categories}>
        {categories?.map((category, i) => (
          <Link
            key={i}
            href={{ pathname: '/search', query: { tag: category.key } }}
          >
            <a>
              <Box className={styles.box}>{category.key}</Box>
            </a>
          </Link>
        ))}
      </div>
    </HomeSection>
  )
}
