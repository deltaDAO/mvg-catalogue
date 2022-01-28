import { ReactElement, useEffect, useState } from 'react'
import Box from '../../atoms/Box'
import FilterOptions, { sortDirectionOptions, TypeKeys } from './FilterOptions'
import styles from './FilterButton.module.css'
import { useRouter } from 'next/router'
import { SortDirectionOptions } from '../../../models/SortAndFilters'

export interface Option {
  display: string
  value: string
  default?: boolean
}

export interface FilterOption {
  display: string
  options: Option[]
}

export default function FilterButton({
  option,
  type
}: {
  option: FilterOption
  type: TypeKeys
}): ReactElement {
  const router = useRouter()
  const { query } = router
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(
    option.options.find((e: Option) => e.default)?.display
  )
  const { display } = option

  const sortDirectionIndicator = sortDirectionOptions.find(
    (e) =>
      e.value ===
      (query?.sortDirection
        ? query.sortDirection
        : SortDirectionOptions.Descending)
  )?.directionArrow

  useEffect(() => {
    if (!query) return
    if (query[type]) setSelected(query[type] as string)
  }, [query, type])

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      onMouseOver={() => setIsOpen(true)}
      onMouseOut={() => setIsOpen(false)}
    >
      <Box
        className={
          isOpen ? `${styles.dropdown} ${styles.active}` : styles.dropdown
        }
      >
        <div className={styles.dropdown__text}>
          {display}
          <strong>{selected}</strong>
          {type === 'sortBy' && (
            <strong className={styles.arrow}>{sortDirectionIndicator}</strong>
          )}
        </div>

        <Box className={styles.dropdown__items}>
          <FilterOptions
            selected={selected}
            type={type}
            sortDirections={type === 'sortBy'}
          />
        </Box>
      </Box>
    </div>
  )
}
