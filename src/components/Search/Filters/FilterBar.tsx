import { filterTypeOptions, TypeKeys } from './FilterOptions'
import FilterButton from './FilterButton'
import styles from './FilterBar.module.css'

export default function FilterBar() {
  const options = Object.entries(filterTypeOptions)

  return (
    <div className={styles.container}>
      {options.map(([type, option], i) => (
        <FilterButton key={i} type={type as TypeKeys} option={option} />
      ))}
    </div>
  )
}
