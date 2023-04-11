import { createContext, useContext } from 'react'

import { createPricesContext } from '@apps/hooks'
import { useFetchState } from '@apps/hooks'
import { useEffectOnce, useInterval } from 'react-use'

import { ChainIds, useNetwork } from './NetworkProvider'

import type { FetchState } from '@apps/types'
import type { FC } from 'react'

interface NetworkPrices {
  nativeToken?: number
  gas?: {
    slow: number
    standard: number
    fast: number
    instant: number
  }
}

interface GasPrice {
  standard: number
  fast: number
  slow: number
  instant: number
}

interface MyCryptoGas {
  safeLow: number
  standard: number
  fast: number
  fastest: number
}

interface MaticMainGas {
  safeLow: number
  standard: number
  fast: number
  fastest: number
  blockTime: number
  blockNumber: number
}

const [useFetchPriceCtx, PricesProvider] = createPricesContext()

export { useFetchPriceCtx, PricesProvider }

const networkPricesCtx = createContext<FetchState<NetworkPrices>>(null as never)

export const NetworkPricesProvider: FC = ({ children }) => {
  const network = useNetwork()
  const [networkPrices, setNetworkPrices] = useFetchState<NetworkPrices>({})

  useEffectOnce(() => {
    const fetchPrices = async () => {
      setNetworkPrices.fetching()

      let gas: GasPrice

      // eth mainnet
      if (network.chainId === ChainIds.EthereumMainnet) {
        const gasStationResponse = await fetch(network.gasStationEndpoint)
        const gasRes: MyCryptoGas = await gasStationResponse.json()
        gas = {
          standard: gasRes.standard,
          fast: gasRes.fast,
          slow: gasRes.safeLow,
          instant: gasRes.fastest,
        }
        // eth testnet
      } else if ([ChainIds.EthereumGoerli, ChainIds.EthereumKovan, ChainIds.EthereumRopsten].includes(network.chainId)) {
        // Testnets should use low gas
        gas = {
          standard: 3,
          fast: 3,
          slow: 3,
          instant: 3,
        }
        // Matic Mainnet + Mumbai
      } else {
        const gasStationResponse = await fetch(network.gasStationEndpoint)
        const gasRes: MaticMainGas = await gasStationResponse.json()
        gas = {
          standard: Math.max(30, gasRes.standard),
          fast: Math.max(30, gasRes.fast),
          slow: Math.max(30, gasRes.safeLow),
          instant: Math.max(30, gasRes.fastest),
        }
      }
      const priceResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${network.coingeckoId}&vs_currencies=usd`)

      const priceResult: Record<typeof network['coingeckoId'], { usd: number }> = await priceResponse.json()
      const nativeToken = priceResult[network.coingeckoId].usd

      setNetworkPrices.value({ nativeToken, gas })
    }

    fetchPrices()
  })

  useInterval(() => {
    const fetchPrices = async () => {
      let gas: GasPrice

      // eth mainnet
      if (network.chainId === ChainIds.EthereumMainnet) {
        const gasStationResponse = await fetch(network.gasStationEndpoint)
        const gasRes: MyCryptoGas = await gasStationResponse.json()
        gas = {
          standard: gasRes.standard,
          fast: gasRes.fast,
          slow: gasRes.safeLow,
          instant: gasRes.fastest,
        }
        // eth testnet
      } else if ([ChainIds.EthereumGoerli, ChainIds.EthereumKovan, ChainIds.EthereumRopsten].includes(network.chainId)) {
        // Testnets should use low gas
        gas = {
          standard: 3,
          fast: 3,
          slow: 3,
          instant: 3,
        }
        // Matic Mainnet + Mumbai
      } else {
        const gasStationResponse = await fetch(network.gasStationEndpoint)
        const gasRes: MaticMainGas = await gasStationResponse.json()
        gas = {
          standard: Math.max(30, gasRes.standard),
          fast: Math.max(30, gasRes.fast),
          slow: Math.max(30, gasRes.safeLow),
          instant: Math.max(30, gasRes.fastest),
        }
      }
      const priceResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${network.coingeckoId}&vs_currencies=usd`)

      const priceResult: Record<typeof network['coingeckoId'], { usd: number }> = await priceResponse.json()
      const nativeToken = priceResult[network.coingeckoId].usd

      setNetworkPrices.value({ nativeToken, gas })
    }

    fetchPrices()
  }, 30e3)

  return <networkPricesCtx.Provider value={networkPrices}>{children}</networkPricesCtx.Provider>
}

export const useNetworkPrices = (): FetchState<NetworkPrices> => useContext(networkPricesCtx)
