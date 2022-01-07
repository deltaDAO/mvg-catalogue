import { ReactElement } from 'react'
import Assetlist from '../Assetlist'
import { SearchResults } from '.'
import Pagination from './Pagination'
import { ParsedUrlQuery } from 'querystring'
import router from 'next/router'
import { MetadataMain } from '../../@types/Metadata'

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
  searchType: MetadataMain['type'] | undefined
  page?: number
}): ReactElement {
  const changePage = (newPage: number) => {
    router.push({
      query: {
        term: query.term,
        page: newPage
      }
    })
  }

  return (
    <div>
      <h4>
        {searchResults.total} {searchType ? searchType : 'result'}
        {searchResults.total === 1 ? '' : 's'}
        {query.term && <span> for "{query.term}"</span>}
      </h4>
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
