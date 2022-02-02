import { chainId, metadataCacheUri } from '../../app.config'
import {
  FilterTerms,
  SearchQuery,
  SearchResponse,
  Sort
} from '../@types/SearchQuery'
import axios, { AxiosResponse } from 'axios'
import { MetadataMain } from '../@types/Metadata'
import {
  FilterByTypeOptions,
  SortByOptions,
  SortDirectionOptions
} from '../models/SortAndFilters'
import { filterTypeOptions } from '../components/Search/Filters/FilterOptions'

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

    return response.data
  } catch (error) {
    console.error(error)
  }
}
