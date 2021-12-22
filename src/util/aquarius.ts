import { chainId, metadataCacheUri } from '../../app.config'
import {
  FilterTerms,
  SearchQuery,
  SearchResponse,
  Sort
} from '../@types/SearchQuery'
import axios, { AxiosResponse } from 'axios'
import Metadata, { MetadataMain } from '../@types/Metadata'

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

export function getBaseQuery(
  filter: FilterTerms[] = [],
  sort?: Sort,
  size?: number
): SearchQuery {
  return {
    from: 0,
    size: size || 10,
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
  type?: MetadataMain['type']
): SearchQuery {
  const baseQuery = getBaseQuery()

  const withTerm = term !== ''

  const query: SearchQuery = {
    ...baseQuery,
    query: {
      ...baseQuery.query,
      bool: {
        ...baseQuery.query.bool,
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
          : undefined,
        must: type && {
          term: {
            'service.attributes.main.type': type
          }
        }
      }
    },
    sort: {
      _score: {
        order: 'desc'
      }
    },
    min_score: withTerm ? 1 : undefined
  }

  return query
}

export async function searchMetadata({
  term,
  type,
  from
}: {
  term: string
  type?: MetadataMain['type']
  from?: number
}): Promise<SearchResponse | undefined> {
  try {
    const searchQuery = {
      ...getSearchQuery(term, type),
      from: from || 0
    }

    //console.log(`Query ${apiBasePath} for ${term}:`, searchQuery)
    const response: AxiosResponse<SearchResponse> = await axios.post(
      apiBasePath,
      searchQuery
    )
    //console.log(`Response:`, response.data)

    return response.data
  } catch (error) {
    console.error(error)
  }
}
