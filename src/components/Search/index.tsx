import { ReactElement, useEffect, useState } from 'react'
import { searchMetadata } from '../../utils/aquarius'
import { MetadataMain, Service } from '../../@types/Metadata'
import Loader from '../atoms/Loader'
import { useRouter } from 'next/router'
import styles from './index.module.css'
import Searchform from './Searchform'
import content from '../../../content/search.json'
import Results from './Results'
import { SortByOptions } from '../../models/SortAndFilters'
import { Sort } from '../../models/SortAndFilters'
import { SearchResponse } from '../../models/aquarius/SearchResponse'

export interface SearchResults {
  total: number
  metadata: MetadataMain[]
}

export const filterAssetMetadata = (data: SearchResponse): SearchResults => ({
  total: data?.hits?.total,
  metadata: data?.hits?.hits
    .filter((hit) => {
      const service = hit._source.service.find(
        (service) => service.type === 'metadata'
      )
      return service
    })
    .map((hit) => ({
      ...(
        hit._source.service.find(
          (service) => service.type === 'metadata'
        ) as Service
      ).attributes.main,
      _id: hit._id
    }))
})

//TODO: refactor / re-scope for readability
export default function SearchPage({
  resultSize = 10
}: {
  resultSize?: number
}): ReactElement {
  const router = useRouter()
  const { query } = router
  const { title } = content

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchTag, setSearchTag] = useState<string>()
  const [searchResultsPerPage, setSearchResultsPerPage] = useState<string>()
  const [searchType, setSearchType] = useState<MetadataMain['type']>()
  const [searchSortBy, setSearchSortBy] = useState<SortByOptions>()
  const [searchSortDirection, setSearchSortDirection] =
    useState<Sort['type']['order']>()
  const [page, setPage] = useState<number>()

  const [searchResults, setSearchResults] = useState<SearchResults>()
  const [loading, setLoading] = useState(false)

  const initFromQueryParams = () => {
    setSearchType(query.type as MetadataMain['type'])
    setPage(parseInt(query.page as string) || 1)
    setSearchResultsPerPage(query.resultsPerPage as string)
    setSearchSortBy(query.sortBy as SortByOptions)
    setSearchSortDirection(query.sortDirection as Sort['type']['order'])
    setSearchTag(query.tag as string)
    setSearchTerm((query.term as string) || '')
  }

  const search = async () => {
    setLoading(true)
    const response = await searchMetadata({
      term: searchTerm,
      from: (page ? (page > 0 ? page - 1 : 0) : 0) * resultSize,
      tag: searchTag,
      size: searchResultsPerPage,
      sortBy: searchSortBy,
      sortDirection: searchSortDirection,
      type: searchType
    })

    if (!response) {
      setLoading(false)
      return
    }

    setSearchResults(filterAssetMetadata(response))
    setLoading(false)
  }

  useEffect(() => {
    initFromQueryParams()
  }, [query])

  useEffect(() => {
    search()
  }, [
    searchTerm,
    searchType,
    searchSortBy,
    searchSortDirection,
    searchResultsPerPage,
    searchTag,
    page
  ])

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <Searchform
        disabled={loading}
        onSubmit={(value) => {
          router.push({
            pathname: '/search',
            query: {
              term: value,
              type: searchType,
              page: page,
              sortBy: searchSortBy,
              sortDirection: searchSortDirection,
              resultsPerPage: searchResultsPerPage
            }
          })
        }}
      />
      {!loading && searchResults ? (
        <Results
          query={query}
          resultSize={resultSize}
          searchResults={searchResults}
          searchType={searchType}
          page={page}
        />
      ) : loading ? (
        <Loader style="spinner" />
      ) : (
        <code>Enter a search value...</code>
      )}
    </div>
  )
}
