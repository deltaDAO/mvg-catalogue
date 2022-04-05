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
import { AssetListPrices, DidAndDatatokenMap } from '../@types/Subgraph'

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

function transformPriceToBestPrice(
  frePrice: AssetsFrePriceFixedRateExchange[],
  poolPrice: AssetsPoolPricePool[],
  freePrice: AssetFreePriceDispenser[]
) {
  if (poolPrice?.length > 0) {
    const price: BestPrice = {
      type: 'pool',
      address: poolPrice[0]?.id,
      value:
        poolPrice[0]?.consumePrice === '-1'
          ? poolPrice[0]?.spotPrice
          : poolPrice[0]?.consumePrice,
      ocean: poolPrice[0]?.oceanReserve,
      oceanSymbol: poolPrice[0]?.tokens[0]?.symbol,
      datatoken: poolPrice[0]?.datatokenReserve,
      pools: [poolPrice[0]?.id],
      isConsumable: poolPrice[0]?.consumePrice === '-1' ? 'false' : 'true'
    }
    return price
  } else if (frePrice?.length > 0) {
    // TODO Hacky hack, temporary™: set isConsumable to true for fre assets.
    // isConsumable: 'true'
    const price: BestPrice = {
      type: 'exchange',
      value: frePrice[0]?.rate,
      address: frePrice[0]?.id,
      exchangeId: frePrice[0]?.id,
      oceanSymbol: frePrice[0]?.baseTokenSymbol,
      ocean: 0,
      datatoken: 0,
      pools: [],
      isConsumable: 'true'
    }
    return price
  } else if (freePrice?.length > 0) {
    const price: BestPrice = {
      type: 'free',
      value: 0,
      address: freePrice[0]?.datatoken.id,
      exchangeId: '',
      ocean: 0,
      datatoken: 0,
      pools: [],
      isConsumable: 'true'
    }
    return price
  } else {
    const price: BestPrice = {
      type: '',
      value: 0,
      address: '',
      exchangeId: '',
      ocean: 0,
      datatoken: 0,
      pools: [],
      isConsumable: 'false'
    }
    return price
  }
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
