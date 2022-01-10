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

const filterTypeOptions = {
  category: [
    { display: 'data sets', value: FilterByTypeOptions.Data },
    { display: 'algorithms', value: FilterByTypeOptions.Algorithm }
  ],
  sort: [
    { display: 'relevance', value: SortByOptions.Relevance },
    { display: 'created', value: SortByOptions.Created },
    { display: 'updated', value: SortByOptions.Updated }
  ],
  resultsPerPage: [
    { display: '10', value: ResultsPerPageOptions.Ten },
    { display: '25', value: ResultsPerPageOptions.TwentyFive },
    { display: '50', value: ResultsPerPageOptions.Fifty }
  ]
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
  type,
  sortDirections
}: {
  type: 'category' | 'sort' | 'resultsPerPage'
  sortDirections?: boolean
}): ReactElement {
  const router = useRouter()
  const { query } = router
  console.log(query)

  return (
    <div className={styles.container}>
      {sortDirections && (
        <div className={styles.sort}>
          {sortDirectionOptions.map((option, i) => (
            <div
              key={i}
              className={cx({
                selected: query.sort === option.value
              })}
            >{`${option.display} ${option.directionArrow}`}</div>
          ))}
        </div>
      )}
      <div className={styles.options}>
        <ul>
          {filterTypeOptions[type].map((option, i) => (
            <li
              key={i}
              className={cx({
                selected: query.type === option.value
              })}
            >
              {option.display}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
