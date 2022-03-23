import { filterTypeOptions } from '../components/Search/Filters/FilterOptions'

export type IFilterTypeOpt = keyof typeof filterTypeOptions

export interface IFilterTypeOptions {
  [key: string]: IFilterOption
}

export interface IFilterOption {
  display?: string
  options: {
    value: string
    display?: string
    default?: boolean
  }[]
}
