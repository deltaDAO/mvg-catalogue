export enum SortDirectionOptions {
  Ascending = 'asc',
  Descending = 'desc'
}

export enum SortTermOptions {
  Created = 'created',
  Relevance = '_score'
}

export enum FilterByTypeOptions {
  All = '',
  Algorithm = 'algorithm',
  Data = 'dataset'
}

export enum SortByOptions {
  Published = 'published',
  Relevance = 'relevance',
  Updated = 'updated'
}

export enum ResultsPerPageOptions {
  Ten = '10',
  TwentyFive = '25',
  Fifty = '50'
}

export interface SortOptions {
  sortBy: SortTermOptions
  sortDirection?: SortDirectionOptions
}

export interface Sort {
  [field: string]: {
    order: 'asc' | 'desc'
  }
}
