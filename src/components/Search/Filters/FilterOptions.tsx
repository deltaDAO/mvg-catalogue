import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import {
  IFilterTypeOpt,
  IFilterTypeOptions
} from '../../../@types/SearchFilterOptions'
import {
  FilterByTypeOptions,
  ResultsPerPageOptions,
  SortByOptions,
  SortDirectionOptions
} from '../../../models/SortAndFilters'
import styles from './FilterOptions.module.css'

export const filterTypeOptions: IFilterTypeOptions = {
  type: {
    display: 'type',
    options: [
      { display: 'all', value: FilterByTypeOptions.All, default: true },
      { value: FilterByTypeOptions.Algorithm },
      { value: FilterByTypeOptions.Data }
    ]
  },
  sortBy: {
    display: 'sort by',
    options: [
      { value: SortByOptions.Published },
      { value: SortByOptions.Updated, default: true }
    ]
  },
  resultsPerPage: {
    display: 'results per page',
    options: [
      { value: ResultsPerPageOptions.Ten, default: true },
      { value: ResultsPerPageOptions.TwentyFive },
      { value: ResultsPerPageOptions.Fifty }
    ]
  }
}

export const sortDirectionOptions = [
  {
    value: SortDirectionOptions.Ascending,
    directionArrow: String.fromCharCode(9650)
  },
  {
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
  type: IFilterTypeOpt
  sortDirections?: boolean
}): ReactElement {
  const router = useRouter()
  const { query } = router

  const [selectedOrderOption, setSelectedOrderOption] = useState(
    query.sortDirection
  )
  const [selectedTypeOption, setSelectedTypeOption] = useState(query[type])

  useEffect(() => {
    if (!selectedOrderOption && !selectedTypeOption && type !== 'type') return
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
    <div>
      {sortDirections && (
        <div className={styles.sort}>
          {sortDirectionOptions.map((option, i) => (
            <label key={`${option.value}-${i}`} className={styles.filterLabel}>
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
              <span>{`${option.value} ${option.directionArrow}`}</span>
            </label>
          ))}
        </div>
      )}
      <div>
        <ul>
          {filterTypeOptions[type]?.options.map((option, i) => (
            <li key={`${option.value}-${i}`}>
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
                <span>{option?.display || option.value}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
