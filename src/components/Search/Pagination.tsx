import { ReactElement } from 'react'
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
        {active > 1 && <li onClick={() => setPage(active - 1)}>previous</li>}
        {pages.map((page, i) => {
          const pageNo = i + 1
          return (
            <li
              className={cx({ active: pageNo === active })}
              key={pageNo}
              onClick={() => setPage(pageNo)}
            >
              {pageNo}
            </li>
          )
        })}
        {active < maxPage && <li onClick={() => setPage(active + 1)}>next</li>}
      </ul>
    </nav>
  )
}
