import { createContext, useContext, FC, useRef } from 'react'

import { providerFactory } from './utils'

interface PriceFetchState {
  fetching?: boolean
  value?: number
  error?: string
  updatedAt?: number
}

interface Prices {
  [address: string]: PriceFetchState
}

type UseFetchPrice = (address?: string) => PriceFetchState

interface CoingeckoPrices {
  [address: string]: { usd: number }
}

const fetchCoingeckoPrices = async (addresses: string[]): Promise<CoingeckoPrices> => {
  const result = await fetch(
    `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${addresses.join(',')}&vs_currencies=USD`,
  )
  return result.json()
}

const TTL = 60 * 60 * 15 * 1000 // 15 mins

export const createPricesContext = (): Readonly<[() => UseFetchPrice, FC]> => {
  const fetchPriceCtx = createContext<UseFetchPrice>(null as never)
  const pricesCtx = createContext<Prices>(null as never)

  const PricesProvider: FC = ({ children }) => {
    const prices = useRef<Prices>({})

    // TODO consider adding network; may need this for wrapped Matic
    const useFetchPrice: UseFetchPrice = (address?: string) => {
      if (!address) return {}

      const cached = prices.current[address]
      if (cached && (cached.fetching || (cached.updatedAt && Date.now() - cached.updatedAt < TTL))) return cached

      // This could be improved by grouping addresses to fetch
      prices.current = { ...prices, [address]: { ...prices.current[address], fetching: true } }
      fetchCoingeckoPrices([address])
        .then(result => {
          const fetched = result?.[address]?.usd

          prices.current = {
            ...prices.current,
            [address]: {
              ...prices.current[address],
              updatedAt: Date.now(),
              value: fetched,
              fetching: false,
              error: fetched ? undefined : 'No price found',
            },
          }
        })
        .catch(error => {
          console.warn('Error fetching CoinGecko prices', error)

          // This could be improved by adding retries
          prices.current = { ...prices.current, [address]: { ...prices.current[address], fetching: false, error, updatedAt: Date.now() } }
        })

      return prices.current[address] ?? {}
    }

    return providerFactory(fetchPriceCtx, { value: useFetchPrice }, providerFactory(pricesCtx, { value: prices.current }, children))
  }

  const useFetchPriceCtx = (): UseFetchPrice => {
    const useFetchPrice = useContext(fetchPriceCtx)
    if (useFetchPrice == null) {
      throw new Error(`useFetchPrice must be used inside a PricesProvider.`)
    }
    return useFetchPrice
  }

  return [useFetchPriceCtx, PricesProvider] as const
}
