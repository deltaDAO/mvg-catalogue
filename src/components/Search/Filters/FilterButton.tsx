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
  // TODO: find better name for option
  list,
  type
}: {
  list: FilterOption
  type: TypeKeys
}): ReactElement {
  const router = useRouter()
  const { query } = router
  const [isOpen, setIsOpen] = useState(false)
  const { display, options } = list
  const [preSelected, setPreSelected] = useState(
    options.findIndex((e: Option) => e.default)
  )

  const sortDirectionIndicator = sortDirectionOptions.find(
    (e) =>
      e.value ===
      (query?.sortDirection
        ? query.sortDirection
        : SortDirectionOptions.Descending)
  )?.directionArrow

  useEffect(() => {
    if (!query) return
    if (query[type])
      setPreSelected(options.findIndex((e: Option) => e.value === query[type]))
  }, [options, query, type])
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
          <strong>{options[preSelected]?.display}</strong>
          {type === 'sortBy' && (
            <strong className={styles.arrow}>{sortDirectionIndicator}</strong>
          )}
        </div>

        <Box className={styles.dropdown__items}>
          <FilterOptions
            preSelected={options[preSelected]?.value}
            type={type}
            sortDirections={type === 'sortBy'}
          />
        </Box>
      </Box>
    </div>
  )
}
