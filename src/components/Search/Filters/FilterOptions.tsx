import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import {
  FilterByTypeOptions,
  ResultsPerPageOptions,
  SortByOptions,
  SortDirectionOptions
} from '../../../models/SortAndFilters'
import styles from './FilterOptions.module.css'

export type TypeKeys = keyof typeof filterTypeOptions

export const filterTypeOptions = {
  type: {
    display: 'type',
    options: [
      { display: 'all', value: FilterByTypeOptions.All, default: true },
      { display: 'algorithm', value: FilterByTypeOptions.Algorithm },
      { display: 'dataset', value: FilterByTypeOptions.Data }
    ]
  },
  sortBy: {
    display: 'sort by',
    options: [
      { display: 'relevance', value: SortByOptions.Relevance, default: true },
      { display: 'published', value: SortByOptions.Published },
      { display: 'updated', value: SortByOptions.Updated }
    ]
  },
  resultsPerPage: {
    display: 'results per page',
    options: [
      { display: '10', value: ResultsPerPageOptions.Ten, default: true },
      { display: '25', value: ResultsPerPageOptions.TwentyFive },
      { display: '50', value: ResultsPerPageOptions.Fifty }
    ]
  }
}

export const sortDirectionOptions = [
  {
    display: `Asc`,
    value: SortDirectionOptions.Ascending,
    directionArrow: String.fromCharCode(9650)
  },
  {
    display: `Desc`,
    value: SortDirectionOptions.Descending,
    directionArrow: String.fromCharCode(9660)
  }
]

export default function FilterOptions({
  preSelected,
  type,
  sortDirections
}: {
  preSelected: string
  type: TypeKeys
  sortDirections?: boolean
}): ReactElement {
  const router = useRouter()
  const { query } = router

  const [selectedOrderOption, setSelectedOrderOption] = useState(
    query.sortDirection
  )
  const [selectedTypeOption, setSelectedTypeOption] = useState(query[type])

  useEffect(() => {
    if (!selectedOrderOption && !selectedTypeOption) return
    router.push({
      pathname: '/search',
      query: {
        ...query,
        [type]: selectedTypeOption,
        sortDirection: selectedOrderOption
      }
    })
  }, [selectedTypeOption, selectedOrderOption])

  return (
    <div className={styles.container}>
      {sortDirections && (
        <div className={styles.sort}>
          {sortDirectionOptions.map((option, i) => (
            <label key={i} className={styles.filterLabel}>
              <input
                type="radio"
                name="sortDirection"
                checked={
                  selectedOrderOption
                    ? option.value === selectedOrderOption
                    : option.value === SortDirectionOptions.Descending
                }
                value={option.value}
                onChange={(e) => setSelectedOrderOption(e.target.value)}
              />
              <span>{`${option.display} ${option.directionArrow}`}</span>
            </label>
          ))}
        </div>
      )}
      <div className={styles.options}>
        <ul>
          {filterTypeOptions[type]?.options.map((option, i) => (
            <li key={i}>
              <label className={styles.filterLabel}>
                <input
                  type="radio"
                  name="filterTypeOptions"
                  checked={
                    selectedTypeOption
                      ? option.value === selectedTypeOption
                      : option.value === preSelected
                  }
                  value={option.value}
                  onChange={(e) => setSelectedTypeOption(e.target.value)}
                />
                <span>{option.display}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
