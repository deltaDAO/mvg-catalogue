import React, { ReactElement, useEffect, useState } from 'react'
import { getPopularTags } from '../../util/aquarius'
import { AggregationBucket, Aggregations } from '../../@types/Aggregates'
import styles from './Categories.module.css'

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
      {categories?.map((category, i) => {
        console.log(category)
        return <div key={i}>{category.key}</div>
      })}
    </div>
  )
}
