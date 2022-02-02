import { ReactElement, useState } from 'react'
import styles from './Searchbar.module.css'
import content from '../../../content/search.json'

export default function Searchbar({
  onChange
}: {
  onChange?: (value: string) => void
}): ReactElement {
  const { placeholder } = content
  const [value, setValue] = useState('')

  return (
    <input
      className={styles.input}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        onChange && onChange(e.target.value)
        setValue(e.target.value)
      }}
    />
  )
}
