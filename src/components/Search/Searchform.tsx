import React, { ReactElement, useState } from 'react'
import { useRouter } from 'next/router'
import Button from '../atoms/Button'
import Searchbar from './Searchbar'
import styles from './Searchform.module.css'

export default function Searchform({
  disabled,
  onSubmit
}: {
  disabled?: boolean
  onSubmit?: (value: string) => void
}): ReactElement {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault()
        if (searchValue) {
          onSubmit
            ? onSubmit(searchValue)
            : router.push({
                pathname: '/search',
                query: {
                  term: searchValue,
                  page: 1
                }
              })
        }
      }}
    >
      <Searchbar
        onChange={(value) => setSearchValue(value)}
        defaultValue={searchValue}
      />
      <Button style="primary" type="submit" disabled={disabled}>
        Search
      </Button>
    </form>
  )
}
