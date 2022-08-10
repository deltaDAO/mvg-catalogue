import Metadata from '../../@types/Metadata'
import { FilterTerms } from './FilterTerm'
import { Sort } from '../SortAndFilters'

export interface SearchQuery {
  query: Query
  from?: number
  size?: number
  sort?: Sort
  min_score?: number
}

export interface Query {
  bool?: BoolQuery
  query_string?: {
    fields: string[]
    query: string
    boost?: number
    minimum_should_match?: string
    lenient?: boolean
    default_operator?: string
  }
  filter?: FilterTerms[]
  match_phrase?: {
    content: {
      boost: number
      query: string
    }
  }
}

export interface BoolQuery {
  filter?: FilterTerms[]
  must?: FilterTerms | Query | Query[]
  should?: FilterTerms | Query | Query[]
  must_not?: FilterTerms | FilterTerms[] | Query | Query[]
}

export interface SearchResponse {
  _shards: any
  hits: {
    hits: {
      _id: string
      _index: string
      _score: number
      _source: Metadata
    }[]
    max_score?: number
    total: number
  }
}
