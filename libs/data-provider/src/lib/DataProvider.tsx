import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { useFeederPoolsQuery } from '@apps/artifacts/graphql/feeders'
import { useMassetsQuery } from '@apps/artifacts/graphql/protocol'
import { useAccount, useSignerOrProvider } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { useNetwork } from '@apps/base/context/network'
import { useTokensState } from '@apps/base/context/tokens'
import { useIdlePollInterval } from '@apps/hooks'
import { Interface } from '@ethersproject/abi'
import { pipe } from 'ts-pipe-compose'

import { recalculateState } from './recalculateState'
import { transformRawData } from './transformRawData'

import type { FeederPoolsQueryResult } from '@apps/artifacts/graphql/feeders'
import type { MassetsQueryResult } from '@apps/artifacts/graphql/protocol'
import type { IMasset } from '@apps/artifacts/typechain'
import type { Tokens } from '@apps/base/context/tokens'
import type { FC } from 'react'

import type { DataState } from './types'

export interface RawData {
  massets: MassetsQueryResult['data']
  feederPools: FeederPoolsQueryResult['data']
  tokens: Tokens
  vaultBalances: { [address: string]: string }
}

const EMPTY_FEEDER_POOLS: RawData['feederPools'] = Object.freeze({
  feederPools: [],
  saveVaults: [],
  userVaults: [],
  boostDirectors: [],
  vaultIds: [],
})

const dataStateCtx = createContext<DataState>({})

const useRawData = (): Pick<RawData, 'massets' | 'feederPools'> => {
  const network = useNetwork()
  const account = useAccount()
  const clients = useApolloClients()
  const pollInterval = useIdlePollInterval(30e3)
  const options = useMemo(() => {
    const baseOptions = {
      variables: { account: account ?? '', accountId: account ?? '', hasAccount: !!account },
      pollInterval,
    }
    return {
      feeders: { ...baseOptions, client: clients.feeders, skip: !Object.prototype.hasOwnProperty.call(network.gqlEndpoints, 'feeders') },
      protocol: { ...baseOptions, client: clients.protocol },
    }
  }, [account, clients, network, pollInterval])

  const massetsSub = useMassetsQuery(options.protocol)
  const feedersSub = useFeederPoolsQuery(options.feeders)

  return {
    massets: massetsSub.data,
    feederPools: feedersSub.data ?? EMPTY_FEEDER_POOLS,
  }
}

export const useDataState = (): DataState => useContext(dataStateCtx)

const massetInterface = (() => {
  const abi = [
    {
      inputs: [],
      name: 'getBassets',
      outputs: [
        {
          components: [
            {
              internalType: 'address',
              name: 'addr',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'integrator',
              type: 'address',
            },
            {
              internalType: 'bool',
              name: 'hasTxFee',
              type: 'bool',
            },
            {
              internalType: 'enum MassetStructs.BassetStatus',
              name: 'status',
              type: 'uint8',
            },
          ],
          internalType: 'struct MassetStructs.BassetPersonal[]',
          name: 'personal',
          type: 'tuple[]',
        },
        {
          components: [
            {
              internalType: 'uint128',
              name: 'ratio',
              type: 'uint128',
            },
            {
              internalType: 'uint128',
              name: 'vaultBalance',
              type: 'uint128',
            },
          ],
          internalType: 'struct MassetStructs.BassetData[]',
          name: 'data',
          type: 'tuple[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ]
  return new Interface(abi) as unknown as IMasset['interface']
})()

// While subgraph data for vault balances needs updating, fetch
// vault balances from the mAsset contracts
const useVaultBalances = (massets: MassetsQueryResult['data']): RawData['vaultBalances'] => {
  const provider = useSignerOrProvider()
  const massetAddressesStr = massets?.massets.map(m => m.id).join(',') ?? ''
  const [vaultBalances, setVaultBalances] = useState<Record<string, string>>()

  useEffect(() => {
    // Only fetch once
    if (!provider || vaultBalances || massetAddressesStr.length === 0) return

    const promises = massetAddressesStr
      .split(',')
      .filter(Boolean)
      .map(async address => {
        const response = await provider.call({
          to: address,
          data: massetInterface.encodeFunctionData('getBassets'),
        })
        const { data, personal } = massetInterface.decodeFunctionResult('getBassets', response) as unknown as {
          personal: { addr: string }[]
          data: { vaultBalance: string }[]
        }
        return data.map(({ vaultBalance }, i) => [personal[i].addr.toLowerCase(), vaultBalance] as [string, string])
      })

    Promise.all(promises)
      .then(result => {
        setVaultBalances(Object.fromEntries(result.flat()))
      })
      .catch(console.error)
  }, [massetAddressesStr, provider, vaultBalances])

  return useMemo(() => {
    if (massets) {
      return Object.fromEntries(
        massets.massets.flatMap(({ basket: { bassets } }) =>
          bassets.map(({ token: { address }, vaultBalance: { exact: fallback } }) => [address, vaultBalances?.[address] ?? fallback]),
        ),
      )
    }

    return {}
  }, [massets, vaultBalances])
}

export const DataProvider: FC = ({ children }) => {
  const { massets, feederPools } = useRawData()
  const { tokens } = useTokensState()
  const vaultBalances = useVaultBalances(massets)

  const [dataStatePrev, setDataStatePrev] = useState<DataState>({})

  const nextDataState = useMemo<DataState | undefined>(() => {
    if (massets && feederPools) {
      const result = pipe<RawData, DataState, DataState>(
        { massets, feederPools, tokens, vaultBalances },
        transformRawData,
        recalculateState,
      )
      // Set the previous data state to this valid state
      setDataStatePrev(result)
      return result
    }
    return undefined
  }, [massets, feederPools, tokens, vaultBalances])

  // Use the previous data state as a fallback; prevents re-renders
  // with missing data
  const value = nextDataState ?? dataStatePrev

  if (process.env.NODE_ENV === 'development') {
    ;(window as { dataState?: DataState }).dataState = value
  }

  return <dataStateCtx.Provider value={value}>{children}</dataStateCtx.Provider>
}
