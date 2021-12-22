import React, { ReactElement, useEffect, useState } from 'react'
import Button from '../atoms/Button'
import Searchbar from '../atoms/Searchbar'
import { getSearchQuery, searchMetadata } from '../../util/aquarius'
import Metadata, { MetadataMain, Service } from '../../@types/Metadata'
import styles from './Searchform.module.css'
import Assetlist from '../Assetlist'
import Loader from '../atoms/Loader'
import Pagination from '../atoms/Pagination'

export interface SearchResults {
  total: number
  metadata: MetadataMain[]
}

export default function Searchform({
  resultSize = 10
}: {
  resultSize?: number
}): ReactElement {
  const [searchValue, setSearchValue] = useState('')
  const [currentSearchTerm, setCurrentSearchTerm] = useState('')

  const [searchResults, setSearchResults] = useState<SearchResults>()
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const search = async () => {
    setLoading(true)
    setCurrentSearchTerm(searchValue)
    setCurrentPage(page)
    const response = await searchMetadata(searchValue, page * resultSize)

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
    currentPage !== page && search()
  }, [page])

  return (
    <div className={styles.container}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          if (searchValue && currentSearchTerm !== searchValue) {
            setPage(0)
            search()
          }
        }}
      >
        <Searchbar onChange={(value) => setSearchValue(value)} />
        <Button
          style="primary"
          type="submit"
          onClick={() => {
            getSearchQuery(searchValue)
          }}
          disabled={loading}
        >
          Search
        </Button>
      </form>
      {!loading && searchResults ? (
        <>
          <h4>
            {searchResults.total}{' '}
            {searchResults.total > 1 ? 'results' : 'result'} for "
            {currentSearchTerm}"
          </h4>
          <Assetlist assets={searchResults.metadata} />
          {searchResults.total > searchResults.metadata.length && (
            <Pagination
              active={page}
              total={searchResults.total}
              size={resultSize}
              setPage={setPage}
            />
          )}
        </>
      ) : loading ? (
        <Loader style="spinner" />
      ) : (
        <code>Enter a search value...</code>
      )}
    </div>
  )
}
