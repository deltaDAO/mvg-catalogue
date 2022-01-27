import { ReactElement, useEffect, useState } from 'react'
import Box from '../../atoms/Box'
import Tooltip from '../../atoms/Tooltip'
import FilterOptions, { filterTypeOptions, TypeKeys } from './FilterOptions'
import styles from './FilterButton.module.css'
import { useRouter } from 'next/router'

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
  const [selected, setSelected] = useState(
    filterTypeOptions[type]?.options.find((e: Option) => e.default).display
  )
  const { display } = option

  useEffect(() => {
    if (!query) return
    if (query[type]) setSelected(query[type])
  }, [query])

  return (
    <Tooltip
      className={styles.container}
      placement="bottom"
      trigger="mouseenter | focus | click"
      content={
        <Box className={styles.tooltip}>
          <FilterOptions
            selected={selected}
            type={type}
            sortDirections={type === 'sort'}
          />
        </Box>
      }
    >
      <Box className={styles.box}>
        {display}
        <strong>{selected}</strong>
        <strong className={styles.arrow}>{String.fromCharCode(9650)}</strong>
      </Box>
    </Tooltip>
  )
}
