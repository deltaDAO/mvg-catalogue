import React, { ReactElement, useEffect, useState } from 'react'
import Button from '../atoms/Button'
import Searchbar from '../atoms/Searchbar'
import { getSearchQuery, searchMetadata } from '../../util/aquarius'
import Metadata, {
  MetadataMain,
  MetadataMainTypes,
  Service
} from '../../@types/Metadata'
import styles from './Searchform.module.css'
import Assetlist from '../Assetlist'
import Loader from '../atoms/Loader'
import Pagination from '../atoms/Pagination'
import { useRouter } from 'next/router'
import { ValueOf } from '../../@types/global'

export interface SearchResults {
  total: number
  metadata: MetadataMain[]
}

export default function Searchform({
  resultSize = 10
}: {
  resultSize?: number
}): ReactElement {
  const { query } = useRouter()

  const [searchValue, setSearchValue] = useState('')
  const [currentSearchTerm, setCurrentSearchTerm] = useState('')

  const [searchType, setSearchType] = useState<
    MetadataMain['type'] | undefined
  >()

  const [searchResults, setSearchResults] = useState<SearchResults>()
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const search = async () => {
    setLoading(true)
    setCurrentSearchTerm(searchValue)
    setCurrentPage(page)
    console.log(`Searching for ${searchValue}, on page ${page}`)
    const response = await searchMetadata({
      term: searchValue,
      from: page * resultSize,
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
    if (currentSearchTerm || searchType || currentPage !== page) search()
  }, [page, currentSearchTerm, searchType])

  useEffect(() => {
    if (!query) return
    console.log(query)
    const { term, sort, page, type } = query
    if (term) setSearchValue(term as string)
    if (page) setPage(Number.parseInt(page as string) - 1)
    if (type && MetadataMainTypes.includes((type as string).toLowerCase()))
      setSearchType(type as MetadataMain['type'])

    if (term) {
      setCurrentSearchTerm(term as string)
    }
  }, [query])

  return (
    <div className={styles.container}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          if (searchValue && currentSearchTerm !== searchValue) {
            setPage(0)
            setCurrentSearchTerm(searchValue)
          }
        }}
      >
        <Searchbar
          onChange={(value) => setSearchValue(value)}
          defaultValue={searchValue}
        />
        <Button style="primary" type="submit" disabled={loading}>
          Search
        </Button>
      </form>
      {!loading && searchResults ? (
        <>
          <h4>
            {searchResults.total} {searchType ? searchType : 'result'}
            {searchResults.total > 1 ? 's' : ''} for "{currentSearchTerm}"
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
