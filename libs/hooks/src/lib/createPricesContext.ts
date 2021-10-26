import React, { useRef, FC, createContext, useContext, useCallback } from 'react'
import { FetchState } from './useFetchState'
import { providerFactory } from './utils'

const fetchCoingeckoPrices = async (addresses: string[]): Promise<{ [address: string]: { usd: number } }> => {
  const result = await fetch(
    `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${addresses.join(',')}&vs_currencies=USD`,
  )
  return result.json()
}

interface State {
  fetching?: boolean
  value?: { [x: string]: number }
  error?: string
  updatedAt?: number
}

interface Dispatch {
  fetchPrice(address?: string): FetchState<number>
  fetchPrices(addresses?: string[]): { [x: string]: number }
}

export const createPricesContext = (): Readonly<[() => Dispatch, FC]> => {
  const fetchPriceCtx = createContext<Dispatch>(null as never)

  const PricesProvider: FC = ({ children }) => {
    const state = useRef<State>({})

    const fetchPrice = useCallback<Dispatch['fetchPrice']>(address => {
      if (!address) return { error: 'No address found' }

      const cached = state.current

      if (cached?.value?.[address]) return { value: cached.value[address] }
      if (cached.fetching) return { fetching: true }

      state.current = { ...state.current, fetching: true }

      fetchCoingeckoPrices([address])
        .then(result => {
          const fetched = result?.[address]?.usd

          state.current = {
            ...state.current,
            updatedAt: Date.now(),
            value: {
              ...state.current?.value,
              [address]: fetched,
            },
            fetching: false,
            error: !!fetched ? undefined : 'No price found',
          }
        })
        .catch(error => {
          console.warn('Error fetching CoinGecko prices', error)

          // This could be improved by adding retries
          state.current = { ...state.current, fetching: false, error, updatedAt: Date.now() }
        })

      return { value: state.current?.value?.[address] }
    }, [])

    const fetchPrices = useCallback<Dispatch['fetchPrices']>(_addresses => {
      const addresses = _addresses?.filter(v => !!v)
      if (!addresses?.length) return {}

      const cached = state.current

      if (!!cached.value) {
        const matches = addresses.filter(v => !!cached?.value?.[v])
        if (matches?.length === addresses?.length) return cached.value ?? {}
      }
      if (cached.fetching) return {}

      state.current = { ...state.current, fetching: true }

      fetchCoingeckoPrices(addresses)
        .then(result => {
          const value = Object.keys(result)
            .map(k => ({
              [k]: result?.[k]?.usd,
            }))
            .reduce((a, b) => ({ ...a, ...b }))

          state.current = {
            ...state.current,
            updatedAt: Date.now(),
            value: {
              ...state.current?.value,
              ...value,
            },
            fetching: false,
            error: !!value?.length ? undefined : 'No price found',
          }
        })
        .catch(error => {
          console.warn('Error fetching CoinGecko prices', error)

          // This could be improved by adding retries
          state.current = { ...state.current, fetching: false, error, updatedAt: Date.now() }
        })

      return state.current?.value ?? {}
    }, [])

    return providerFactory(fetchPriceCtx, { value: { fetchPrice, fetchPrices } }, children)
  }

  const useFetchPriceCtx = (): Dispatch => {
    const useFetchPrice = useContext(fetchPriceCtx)
    if (useFetchPrice == null) {
      throw new Error(`useFetchPrice must be used inside a PricesProvider.`)
    }
    return useFetchPrice
  }

  return [useFetchPriceCtx, PricesProvider] as const
}
