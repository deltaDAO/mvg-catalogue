import React, { ReactElement, useEffect, useState } from 'react'
import Button from '../atoms/Button'
import Searchbar from './Searchbar'
import { searchMetadata } from '../../util/aquarius'
import { MetadataMain, MetadataMainTypes, Service } from '../../@types/Metadata'
import Assetlist from '../Assetlist'
import Loader from '../atoms/Loader'
import Pagination from './Pagination'
import { useRouter } from 'next/router'
import styles from './index.module.css'
import Searchform from './Searchform'

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

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchType, setSearchType] = useState<
    MetadataMain['type'] | undefined
  >()
  const [page, setPage] = useState<number>()

  const [searchResults, setSearchResults] = useState<SearchResults>()
  const [loading, setLoading] = useState(false)

  const initFromQueryParams = () => {
    if (MetadataMainTypes.includes(query.type as string))
      setSearchType(query.type as MetadataMain['type'])

    setPage(Number.parseInt(query.page as string))
    setSearchTerm((query.term as string) || '')
  }

  const changePage = (newPage: number) => {
    router.push({
      query: {
        term: query.term,
        page: newPage
      }
    })
  }

  const search = async () => {
    setLoading(true)
    console.log(`Searching for ${searchTerm}, on page ${page}`)
    const response = await searchMetadata({
      term: searchTerm,
      from: (page ? (page > 0 ? page - 1 : 0) : 0) * resultSize,
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
    if (searchTerm || searchType) search()
  }, [searchTerm, searchType, page])

  return (
    <div className={styles.container}>
      <Searchform
        disabled={loading}
        onSubmit={(value) => {
          router.push({
            pathname: '/search',
            query: {
              term: value,
              type: searchType,
              page: 1
            }
          })
        }}
      />
      {!loading && searchResults ? (
        <>
          <h4>
            {searchResults.total} {searchType ? searchType : 'result'}
            {searchResults.total === 1 ? '' : 's'}
            {query.term && <span> for "{query.term}"</span>}
          </h4>
          <Assetlist assets={searchResults.metadata} />
          {searchResults.total > searchResults.metadata.length && (
            <Pagination
              active={page || 1}
              total={searchResults.total}
              size={resultSize}
              setPage={changePage}
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
