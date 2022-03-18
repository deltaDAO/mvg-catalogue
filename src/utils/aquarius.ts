import { DID, DDO, Logger } from '@oceanprotocol/lib'
import { chainId, metadataCacheUri } from '../../app.config'
import {
  FilterTerms,
  SearchQuery,
  SearchResponse,
  Sort
} from '../@types/SearchQuery'
import axios, { AxiosResponse, CancelToken } from 'axios'
import { MetadataMain } from '../@types/Metadata'
import {
  FilterByTypeOptions,
  SortByOptions,
  SortDirectionOptions,
  SortTermOptions
} from '../models/SortAndFilters'
import { toast } from 'react-toastify'
import { PagedAssets } from '../models/PagedAssets'

/**
 * @param filterField the name of the actual field from the ddo schema e.g. 'id','service.attributes.main.type'
 * @param value the value of the filter
 * @returns json structure of the es filter
 */
export function getFilterTerm(
  filterField: string,
  value: string | number | boolean | number[] | string[],
  key: 'terms' | 'term' | 'match' = 'term'
): FilterTerms {
  const isArray = Array.isArray(value)
  const useKey = key === 'term' ? (isArray ? 'terms' : 'term') : key
  return {
    [useKey]: {
      [filterField]: value
    }
  }
}

const apiBasePath = `${metadataCacheUri}/api/v1/aquarius/assets/query`

export const defaultSearchFields = [
  'id',
  'publicKey.owner',
  'dataToken',
  'dataTokenInfo.name',
  'dataTokenInfo.symbol',
  'service.attributes.main.name^10',
  'service.attributes.main.author',
  'service.attributes.additionalInformation.description',
  'service.attributes.additionalInformation.tags'
]

export const defaultSortByFields = {
  [SortByOptions.Relevance]: '_score',
  [SortByOptions.Published]: 'service.attributes.main.datePublished',
  [SortByOptions.Updated]: 'updated'
}

export function getBaseQuery(
  filter: FilterTerms[] = [],
  sort?: Sort,
  size = 10
): SearchQuery {
  return {
    from: 0,
    size: size,
    query: {
      bool: {
        filter: [
          {
            term: {
              chainId: chainId
            }
          },
          {
            term: {
              _index: 'ocean'
            }
          },
          {
            term: {
              isInPurgatory: 'false'
            }
          },
          ...filter
        ]
      }
    },
    sort: sort
  }
}

export function getSearchQuery(
  term: string,
  tag?: string,
  size?: string,
  sortBy?: SortByOptions,
  sortDirection?: Sort['type']['order'],
  type?: MetadataMain['type']
): SearchQuery {
  const baseQuery = getBaseQuery()

  const withTerm = term !== ''

  const filters: FilterTerms[] = [
    ...(baseQuery.query.bool?.filter as FilterTerms[])
  ]
  const sortKey = sortBy
    ? defaultSortByFields[sortBy]
    : defaultSortByFields[SortByOptions.Relevance]

  filters.push(
    type
      ? {
          term: {
            'service.attributes.main.type': type
          }
        }
      : {
          terms: {
            'service.attributes.main.type': [
              FilterByTypeOptions.Algorithm,
              FilterByTypeOptions.Data
            ]
          }
        }
  )

  if (tag)
    filters.push({
      term: {
        'service.attributes.additionalInformation.tags': tag
      }
    })
  if (size) baseQuery.size = parseInt(size)

  const query: SearchQuery = {
    ...baseQuery,
    query: {
      ...baseQuery.query,
      bool: {
        ...baseQuery.query.bool,
        filter: filters,
        should: withTerm
          ? [
              {
                query_string: {
                  boost: 5,
                  fields: defaultSearchFields,
                  minimum_should_match: '2<75%',
                  query: term
                }
              },
              {
                query_string: {
                  boost: 5,
                  fields: defaultSearchFields,
                  lenient: true,
                  query: term
                }
              },
              {
                match_phrase: {
                  content: {
                    boost: 10,
                    query: term
                  }
                }
              }
            ]
          : undefined
      }
    },
    sort: {
      [sortKey]: {
        order: sortDirection || SortDirectionOptions.Descending
      }
    },
    min_score: withTerm ? 1 : undefined
  }

  return query
}

export async function searchMetadata({
  term,
  from,
  tag,
  size,
  sortBy,
  sortDirection,
  type
}: {
  term: string
  from?: number
  tag?: string
  size?: string
  sortBy?: SortByOptions
  sortDirection?: Sort['type']['order']
  type?: MetadataMain['type']
}): Promise<SearchResponse | undefined> {
  try {
    const searchQuery = {
      ...getSearchQuery(term, tag, size, sortBy, sortDirection, type),
      from: from || 0
    }
    const response: AxiosResponse<SearchResponse> = await axios.post(
      apiBasePath,
      searchQuery
    )
    return response.data
  } catch (error) {
    console.error(error)
    toast.error('Could not retrieve assets metadata.')
  }
}

export async function getPopularTags(size = 10) {
  try {
    const tagQuery = {
      ...getBaseQuery(),
      aggs: {
        popular_tags: {
          significant_text: {
            field: 'service.attributes.additionalInformation.tags',
            size: size
          }
        }
      },
      size: 0
    }

    const response = await axios.post(apiBasePath, tagQuery)

    return response.data
  } catch (error) {
    console.error(error)
    toast.error('Could not retrieve popular tags list.')
  }
}

export async function getAllTags() {
  try {
    const tagQuery = {
      ...getBaseQuery(),
      aggs: {
        popular_tags: {
          significant_text: {
            field: 'service.attributes.additionalInformation.tags'
          }
        }
      },
      size: 0
    }

    const response = await axios.post(apiBasePath, tagQuery)

    return response.data
  } catch (error) {
    console.error(error)
    toast.error('Could not retrieve tags list.')
  }
}

export async function getRecentlyPublishedAssets(size = 10) {
  try {
    const recentQuery = {
      ...getBaseQuery(),
      sort: {
        [defaultSortByFields[SortByOptions.Published]]: {
          order: SortDirectionOptions.Descending
        }
      },
      size
    }
    const response = await axios.post(apiBasePath, recentQuery)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error(error)
    toast.error('Could not retrieve recently published assets list.')
  }
}

export function transformQueryResult(
  queryResult: SearchResponse,
  from = 0,
  size = 21
): PagedAssets {
  const result: PagedAssets = {
    results: [],
    page: 0,
    totalPages: 0,
    totalResults: 0
  }

  result.results = (queryResult.hits.hits || []).map(
    (hit) => new DDO(hit._source as DDO)
  )
  result.totalResults = queryResult.hits.total
  result.totalPages =
    result.totalResults / size < 1
      ? Math.floor(result.totalResults / size)
      : Math.ceil(result.totalResults / size)
  result.page = from ? from / size + 1 : 1

  return result
}

export async function queryMetadata(
  query: SearchQuery,
  cancelToken: CancelToken
): Promise<PagedAssets> {
  try {
    const response: AxiosResponse<SearchResponse> = await axios.post(
      `${metadataCacheUri}/api/v1/aquarius/assets/query`,
      { ...query },
      { cancelToken }
    )
    if (!response || response.status !== 200 || !response.data) return
    return transformQueryResult(response.data, query.from, query.size)
  } catch (error) {
    if (axios.isCancel(error)) {
      Logger.log(error.message)
    } else {
      Logger.error(error.message)
    }
  }
}

export async function retrieveDDOListByDIDs(
  didList: string[],
  cancelToken: CancelToken
): Promise<DDO[]> {
  try {
    if (didList?.length === 0) return []
    const orderedDDOListByDIDList: DDO[] = []

    const filter = [getFilterTerm('id', didList)]
    const sort = {
      [SortTermOptions.Created]: { order: SortDirectionOptions.Descending }
    }
    const query = getBaseQuery(filter, sort, didList.length)

    const result = await queryMetadata(query, cancelToken)
    didList.forEach((did: string | DID) => {
      const ddo: DDO = result.results.find((ddo: DDO) => ddo.id === did)
      orderedDDOListByDIDList.push(ddo)
    })
    return orderedDDOListByDIDList
  } catch (error) {
    Logger.error(error.message)
  }
}
