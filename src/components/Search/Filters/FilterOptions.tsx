import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import {
  FilterByTypeOptions,
  ResultsPerPageOptions,
  SortByOptions,
  SortDirectionOptions
} from '../../../models/SortAndFilters'
import styles from './FilterOptions.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

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

const sortDirectionOptions = [
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
  selected,
  type,
  sortDirections
}: {
  selected: string
  type: TypeKeys
  sortDirections?: boolean
}): ReactElement {
  const router = useRouter()
  const { query } = router

  return (
    <div className={styles.container}>
      {sortDirections && (
        <div className={styles.sort}>
          {sortDirectionOptions.map((option, i) => (
            <div
              key={i}
              className={cx({
                selected: query.sortDirection
                  ? query.sortDirection === option.value
                  : option.value === SortDirectionOptions.Descending
              })}
              onClick={() =>
                router.push({
                  pathname: '/search',
                  query: {
                    ...query,
                    sortDirection: option.value
                  }
                })
              }
            >{`${option.display} ${option.directionArrow}`}</div>
          ))}
        </div>
      )}
      <div className={styles.options}>
        <ul>
          {filterTypeOptions[type]?.options.map((option, i) => (
            <li
              key={i}
              className={cx({
                selected: option.value === selected
              })}
              onClick={() =>
                router.push({
                  pathname: '/search',
                  query: {
                    ...query,
                    [type]: option.value
                  }
                })
              }
            >
              {option.display}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
