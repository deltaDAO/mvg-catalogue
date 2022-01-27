import React, { ReactElement, useEffect, useState } from 'react'
import { searchMetadata } from '../../util/aquarius'
import { MetadataMain, MetadataMainTypes, Service } from '../../@types/Metadata'
import Loader from '../atoms/Loader'
import { useRouter } from 'next/router'
import styles from './index.module.css'
import Searchform from './Searchform'
import content from '../../../content/search.json'
import Results from './Results'
import { FilterByTypeOptions } from '../../models/SortAndFilters'
import { Sort } from '../../@types/SearchQuery'

export interface SearchResults {
  total: number
  metadata: MetadataMain[]
}

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
  const [searchSort, setSearchSort] = useState<string>('created')
  const [searchSortDirection, setSearchSortDirection] =
    useState<Sort['type']['order']>('desc')
  const [page, setPage] = useState<number>()

  const [searchResults, setSearchResults] = useState<SearchResults>()
  const [loading, setLoading] = useState(false)

  const initFromQueryParams = () => {
    if (MetadataMainTypes.includes(query.type as string))
      setSearchType(query.type as MetadataMain['type'])
    setPage(Number.parseInt(query.page as string))
    setSearchResultsPerPage(query?.resultsPerPage)
    setSearchSort(query.sort as string)
    setSearchSortDirection(query.sortDirection as Sort['type']['order'])
    if (query.tag) setSearchTag(query.tag)
    setSearchTerm((query.term as string) || '')
  }

  const search = async () => {
    setLoading(true)
    console.log(`Searching for ${searchTerm}, on page ${page}`)
    const response = await searchMetadata({
      term: searchTerm,
      from: (page ? (page > 0 ? page - 1 : 0) : 0) * resultSize,
      tag: searchTag,
      size: searchResultsPerPage,
      sortBy: searchSort,
      sortDirection: searchSortDirection,
      type: searchType
    })

    if (!response) {
      setLoading(false)
      return
    }

    setSearchResults({
      total: response.hits.total,
      metadata: response.hits.hits
        .filter((hit) => {
          const service = hit._source.service.find(
            (service) => service.type === 'metadata'
          )
          return service
        })
        .map(
          (hit) =>
            (
              hit._source.service.find(
                (service) => service.type === 'metadata'
              ) as Service
            ).attributes.main
        )
    })
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
    searchSort,
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
              sortBy: searchSort,
              sortDirection: searchSortDirection
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
