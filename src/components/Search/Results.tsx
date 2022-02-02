import { ReactElement } from 'react'
import Assetlist from '../Assetlist'
import { SearchResults } from '.'
import Pagination from './Pagination'
import { ParsedUrlQuery } from 'querystring'
import router from 'next/router'
import { MetadataMain } from '../../@types/Metadata'
import FilterBar from './Filters/FilterBar'
import styles from './Results.module.css'

export default function Results({
  query,
  resultSize,
  searchResults,
  searchType,
  page = 1
}: {
  query: ParsedUrlQuery
  resultSize: number
  searchResults: SearchResults
  searchType?: MetadataMain['type']
  page?: number
}): ReactElement {
  const changePage = (newPage: number) => {
    router.push({
      query: {
        ...query,
        page: newPage
      }
    })
  }
  return (
    <div>
      <div className={styles.header}>
        <h4>
          {searchResults.total} {searchType ? searchType : 'result'}
          {searchResults.total === 1 ? '' : 's'}
          {query.term && <span> for "{query.term}"</span>}
        </h4>
        <FilterBar />
      </div>

      <Assetlist assets={searchResults.metadata} />
      {searchResults.total > searchResults.metadata.length && (
        <Pagination
          active={page}
          total={searchResults.total}
          size={resultSize}
          setPage={changePage}
        />
      )}
    </div>
  )
}
