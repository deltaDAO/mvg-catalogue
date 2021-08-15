import React, { ReactElement, useState, useEffect } from 'react'
import Permission from '../../organisms/Permission'
import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import AssetListCatalog from '../../organisms/AssetListCatalog'
import styles from './index.module.css'
import ServiceFilter from './filterService'
import Sort from './sort'
import Tags from './Tags'
import queryString from 'query-string'
import { getResults } from '../../templates/Search/utils'
import { navigate } from 'gatsby'
import { updateQueryStringParameter } from '../../../utils'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'
import { useUserPreferences } from '../../../providers/UserPreferences'

export default function CatalogPage({
  location
}: {
  location: Location
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const parsed = queryString.parse(location.search)
  const { text, owner, tags, page, sort, sortOrder, serviceType } = parsed
  const { chainIds } = useUserPreferences()
  const [queryResult, setQueryResult] = useState<QueryResult>()
  const [loading, setLoading] = useState<boolean>()
  const [service, setServiceType] = useState<string>(serviceType as string)
  const [sortType, setSortType] = useState<string>(sort as string)
  const [sortDirection, setSortDirection] = useState<string>(
    sortOrder as string
  )

  useEffect(() => {
    if (!appConfig.metadataCacheUri) return
    async function initSearch() {
      setLoading(true)
      const queryResult = await getResults(
        parsed,
        appConfig.metadataCacheUri,
        chainIds
      )
      setQueryResult(queryResult)
      setLoading(false)
    }
    initSearch()
  }, [
    text,
    owner,
    tags,
    sort,
    page,
    serviceType,
    sortOrder,
    appConfig.metadataCacheUri,
    chainIds
  ])

  function setPage(page: number) {
    const newUrl = updateQueryStringParameter(
      location.pathname + location.search,
      'page',
      `${page}`
    )
    return navigate(newUrl)
  }

  return (
    <Permission eventType="browse">
      <>
        <div className={styles.search}>
          <div className={styles.row}>
            <ServiceFilter
              serviceType={service}
              setServiceType={setServiceType}
            />
            <Tags location={location} />
            <Sort
              sortType={sortType}
              sortDirection={sortDirection}
              setSortType={setSortType}
              setSortDirection={setSortDirection}
            />
          </div>
        </div>
        <div className={styles.results}>
          <AssetListCatalog
            assets={queryResult?.results}
            showPagination
            isLoading={loading}
            page={queryResult?.page}
            totalPages={queryResult?.totalPages}
            onPageChange={setPage}
          />
        </div>
      </>
    </Permission>
  )
}
