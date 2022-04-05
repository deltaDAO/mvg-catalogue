import { SortOptions } from '../SortAndFilters'
import { EsPaginationOptions } from './EsPaginationOptions'
import { FilterTerms } from './FilterTerm'

export interface BaseQueryParams {
  chainIds: number[]
  nestedQuery?: any
  esPaginationOptions?: EsPaginationOptions
  sortOptions?: SortOptions
  filters?: FilterTerms[]
  ignorePurgatory?: boolean
}
