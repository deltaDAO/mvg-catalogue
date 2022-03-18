import { gql, OperationResult, TypedDocumentNode, OperationContext } from 'urql'
import { DDO } from '@oceanprotocol/lib'
import { getUrqlClientInstance } from '../providers/UrqlProvider'
import { getOceanConfig } from './ocean'
import {
  AssetsPoolPrice,
  AssetsPoolPrice_pools as AssetsPoolPricePool
} from '../@types/apollo/AssetsPoolPrice'
import {
  AssetsFrePrice,
  AssetsFrePrice_fixedRateExchanges as AssetsFrePriceFixedRateExchange
} from '../@types/apollo/AssetsFrePrice'
import {
  AssetsFreePrice,
  AssetsFreePrice_dispensers as AssetFreePriceDispenser
} from '../@types/apollo/AssetsFreePrice'
import { BestPrice } from '../models/BestPrice'

export interface UserLiquidity {
  price: string
  oceanBalance: string
}

export interface PriceList {
  [key: string]: string
}

export interface AssetListPrices {
  ddo: DDO
  price: BestPrice
}

interface DidAndDatatokenMap {
  [name: string]: string
}

const FreeQuery = gql`
  query AssetsFreePrice($datatoken_in: [String!]) {
    dispensers(orderBy: id, where: { datatoken_in: $datatoken_in }) {
      datatoken {
        id
        address
      }
    }
  }
`

const FreQuery = gql`
  query AssetsFrePrice($datatoken_in: [String!]) {
    fixedRateExchanges(orderBy: id, where: { datatoken_in: $datatoken_in }) {
      rate
      id
      baseTokenSymbol
      datatoken {
        id
        address
        symbol
      }
    }
  }
`

const PoolQuery = gql`
  query AssetsPoolPrice($datatokenAddress_in: [String!]) {
    pools(where: { datatokenAddress_in: $datatokenAddress_in }) {
      id
      spotPrice
      consumePrice
      datatokenAddress
      datatokenReserve
      oceanReserve
      tokens(where: { isDatatoken: false }) {
        isDatatoken
        symbol
      }
    }
  }
`

export function getSubgraphUri(chainId: number): string {
  const config = getOceanConfig(chainId)
  return config.subgraphUri
}

export function getQueryContext(chainId: number): OperationContext {
  const queryContext: OperationContext = {
    url: `${getSubgraphUri(
      Number(chainId)
    )}/subgraphs/name/oceanprotocol/ocean-subgraph`,
    requestPolicy: 'cache-and-network'
  }

  return queryContext
}

export async function fetchData(
  query: TypedDocumentNode,
  variables: any,
  context: OperationContext
): Promise<any> {
  try {
    const client = getUrqlClientInstance()
    const response = await client.query(query, variables, context).toPromise()
    return response
  } catch (error) {
    console.error('Error fetchData: ', error.message)
    throw Error(error.message)
  }
}

async function getAssetsPoolsExchangesAndDatatokenMap(
  assets: DDO[]
): Promise<
  [
    AssetsPoolPricePool[],
    AssetsFrePriceFixedRateExchange[],
    AssetFreePriceDispenser[],
    DidAndDatatokenMap
  ]
> {
  const didDTMap: DidAndDatatokenMap = {}
  const chainAssetLists: any = {}

  for (const ddo of assets) {
    didDTMap[ddo?.dataToken.toLowerCase()] = ddo.id
    //  harcoded until we have chainId on assets
    if (chainAssetLists[ddo.chainId]) {
      chainAssetLists[ddo.chainId].push(ddo?.dataToken.toLowerCase())
    } else {
      chainAssetLists[ddo.chainId] = []
      chainAssetLists[ddo.chainId].push(ddo?.dataToken.toLowerCase())
    }
  }
  let poolPriceResponse: AssetsPoolPricePool[] = []
  let frePriceResponse: AssetsFrePriceFixedRateExchange[] = []
  let freePriceResponse: AssetFreePriceDispenser[] = []

  for (const chainKey in chainAssetLists) {
    const freVariables = {
      datatoken_in: chainAssetLists[chainKey]
    }
    const poolVariables = {
      datatokenAddress_in: chainAssetLists[chainKey]
    }
    const freeVariables = {
      datatoken_in: chainAssetLists[chainKey]
    }

    const queryContext = getQueryContext(Number(chainKey))

    const chainPoolPriceResponse: OperationResult<AssetsPoolPrice> =
      await fetchData(PoolQuery, poolVariables, queryContext)

    poolPriceResponse = poolPriceResponse.concat(
      chainPoolPriceResponse.data.pools
    )
    const chainFrePriceResponse: OperationResult<AssetsFrePrice> =
      await fetchData(FreQuery, freVariables, queryContext)

    frePriceResponse = frePriceResponse.concat(
      chainFrePriceResponse.data.fixedRateExchanges
    )

    const chainFreePriceResponse: OperationResult<AssetsFreePrice> =
      await fetchData(FreeQuery, freeVariables, queryContext)

    freePriceResponse = freePriceResponse.concat(
      chainFreePriceResponse.data.dispensers
    )
  }
  return [poolPriceResponse, frePriceResponse, freePriceResponse, didDTMap]
}

export async function getAssetsBestPrices(
  assets: DDO[],
  filterByTypes?: {
    filterType: 'whitelist' | 'blacklist'
    priceTypes: BestPrice['type'][]
  }
): Promise<AssetListPrices[]> {
  const assetsWithPrice: AssetListPrices[] = []

  const values: [
    AssetsPoolPricePool[],
    AssetsFrePriceFixedRateExchange[],
    AssetFreePriceDispenser[],
    DidAndDatatokenMap
  ] = await getAssetsPoolsExchangesAndDatatokenMap(assets)

  const poolPriceResponse = values[0]
  const frePriceResponse = values[1]
  const freePriceResponse = values[2]
  for (const ddo of assets) {
    const dataToken = ddo.dataToken.toLowerCase()
    const poolPrice: AssetsPoolPricePool[] = []
    const frePrice: AssetsFrePriceFixedRateExchange[] = []
    const freePrice: AssetFreePriceDispenser[] = []
    const pool = poolPriceResponse.find(
      (pool: AssetsPoolPricePool) => pool.datatokenAddress === dataToken
    )
    pool && poolPrice.push(pool)
    const fre = frePriceResponse.find(
      (fre: AssetsFrePriceFixedRateExchange) =>
        fre.datatoken.address === dataToken
    )
    fre && frePrice.push(fre)
    const free = freePriceResponse.find(
      (free: AssetFreePriceDispenser) => free.datatoken.address === dataToken
    )
    free && freePrice.push(free)
    const bestPrice = transformPriceToBestPrice(frePrice, poolPrice, freePrice)
    assetsWithPrice.push({
      ddo: ddo,
      price: bestPrice
    })
  }

  return filterByTypes
    ? assetsWithPrice.filter((asset) =>
        filterByTypes.filterType === 'blacklist'
          ? !filterByTypes.priceTypes.includes(asset.price.type)
          : filterByTypes.priceTypes.includes(asset.price.type)
      )
    : assetsWithPrice
}
