import React, { ReactElement, useState } from 'react'
import styles from './Searchbar.module.css'

export default function Searchbar({
  defaultValue,
  onChange
}: {
  defaultValue?: string
  onChange?: (value: string) => void
}): ReactElement {
  const [value, setValue] = useState(defaultValue || '')

  return (
    <>
      <input
        className={styles.input}
        type="text"
        placeholder="Search the Federated Catalogue..."
        value={value}
        onChange={(e) => {
          onChange && onChange(e.target.value)
          setValue(e.target.value)
        }}
      />
    </>
  )
}
