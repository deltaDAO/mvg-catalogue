import { filterTypeOptions } from './FilterOptions'
import FilterButton from './FilterButton'
import styles from './FilterBar.module.css'

export default function FilterBar() {
  const options = Object.entries(filterTypeOptions)

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        {options.map(([type, list], i) => (
          <FilterButton key={i} type={type} list={list} />
        ))}
      </div>
    </div>
  )
}
