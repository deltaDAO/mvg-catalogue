import React, { ReactElement } from 'react'
import styles from './Pagination.module.css'
import classnames from 'classnames/bind'

const cx = classnames.bind(styles)

export default function Pagination({
  active,
  total,
  size,
  setPage
}: {
  active: number
  total: number
  size: number
  setPage: (page: number) => void
}): ReactElement {
  const maxPage = Math.ceil(total / size)
  const pages = new Array(maxPage).fill(0)

  return (
    <nav className={styles.pagination}>
      <ul>
        {active > 0 && <li onClick={() => setPage(active - 1)}>previous</li>}
        {pages.map((page, i) => {
          return (
            <li
              className={cx({ active: i === active })}
              key={i}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </li>
          )
        })}
        {active + 1 < maxPage && (
          <li onClick={() => setPage(active + 1)}>next</li>
        )}
      </ul>
    </nav>
  )
}
