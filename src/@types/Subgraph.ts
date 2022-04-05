import { BestPrice, DDO } from '@oceanprotocol/lib'

export interface AssetListPrices {
  ddo: DDO
  price: BestPrice
}

export interface DidAndDatatokenMap {
  [name: string]: string
}
