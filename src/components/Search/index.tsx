import React, { ReactElement, useEffect, useState } from 'react'
import { searchMetadata } from '../../util/aquarius'
import { MetadataMain, MetadataMainTypes, Service } from '../../@types/Metadata'
import Loader from '../atoms/Loader'
import { useRouter } from 'next/router'
import styles from './index.module.css'
import Searchform from './Searchform'
import content from '../../../content/search.json'
import Results from './Results'
import { FilterByTypeOptions, SortByOptions } from '../../models/SortAndFilters'
import { SearchResponse, Sort } from '../../@types/SearchQuery'

export interface SearchResults {
  total: number
  metadata: MetadataMain[]
}

export const filterAssetMetadata = (data: SearchResponse): SearchResults => ({
  total: data.hits.total,
  metadata: data.hits.hits
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
  const [searchType, setSearchType] = useState<
    MetadataMain['type'] | undefined
  >()
  const [searchSortBy, setSearchSortBy] = useState<SortByOptions>()
  const [searchSortDirection, setSearchSortDirection] =
    useState<Sort['type']['order']>('desc')
  const [page, setPage] = useState<number>()

  const [searchResults, setSearchResults] = useState<SearchResults>()
  const [loading, setLoading] = useState(false)

  const initFromQueryParams = () => {
    if (MetadataMainTypes.includes(query.type as string))
      setSearchType(query.type as MetadataMain['type'])
    setPage(Number.parseInt(query.page as string))
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
    if (searchTerm || searchType || searchTag) search()
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
              type: searchType || FilterByTypeOptions.All,
              page: 1,
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
