import React, {
  useState,
  ReactElement,
  createContext,
  useContext,
  ReactNode
} from 'react'
import { fetchData } from '../utils'
import useSWR from 'swr'
import { currency } from '../../app.config'
import { Logger } from '@oceanprotocol/lib'

interface PricesValue {
  [key: string]: number
}

const initialData: PricesValue = {
  eur: 0.0,
  usd: 0.0,
  eth: 0.0,
  btc: 0.0
}

const refreshInterval = 120000 // 120 sec.

const PricesContext = createContext(null)

export default function PricesProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const tokenId = 'ocean-protocol'
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=${currency}`

  const [prices, setPrices] = useState(initialData)

  const onSuccess = async (data: { [tokenId]: { [key: string]: number } }) => {
    if (!data) return
    Logger.log('[prices] Got new OCEAN spot prices.', data[tokenId])
    setPrices(data[tokenId])
  }

  // Fetch new prices periodically with swr
  useSWR(url, fetchData, {
    refreshInterval,
    onSuccess
  })

  return (
    <PricesContext.Provider value={{ prices }}>
      {children}
    </PricesContext.Provider>
  )
}

// Helper hook to access the provider values
const usePrices = (): PricesValue => useContext(PricesContext)

export { PricesProvider, usePrices, PricesValue }
