import { ReactElement, useEffect, useState } from 'react'
import { getPopularTags } from '../../utils/aquarius'
import { AggregationBucket } from '../../@types/Aggregates'
import styles from './Categories.module.css'
import Link from 'next/link'
import Box from '../atoms/Box'
import HomeSection from './HomeSection'
import Loader from '../atoms/Loader'

export default function Categories({
  size = 6
}: {
  size?: number
}): ReactElement {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<AggregationBucket[]>([])

  useEffect(() => {
    const loadPopularCategories = async () => {
      setLoading(true)
      const data = await getPopularTags(size)
      setCategories(data.aggregations?.popular_tags?.buckets)
      setLoading(false)
    }
    loadPopularCategories()
  }, [size])
  return (
    <HomeSection title="Popular Categories">
      {categories.length > 0 ? (
        <div className={styles.categories}>
          {categories?.map((category) => (
            <Link
              key={category.key}
              href={{ pathname: '/search', query: { tag: category.key } }}
            >
              <a>
                <Box className={styles.box}>{category.key}</Box>
              </a>
            </Link>
          ))}
        </div>
      ) : loading ? (
        <Loader style="spinner" />
      ) : (
        <code>Categories could not be loaded.</code>
      )}
    </HomeSection>
  )
}
