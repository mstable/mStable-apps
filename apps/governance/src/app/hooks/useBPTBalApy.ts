import React, { useMemo } from 'react'
import { gql, useQuery } from '@apollo/client'
import { useApolloClients } from '@apps/base/context/apollo'
import { ChainIds, getNetwork } from '@apps/base/context/network'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { FetchState, useFetchState } from '@apps/hooks'

const {
  addresses: { MTA },
} = getNetwork(ChainIds.EthereumMainnet)

const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const BAL = '0xba100000625a3754423978a60c9317c58a424e3d'
const POOL_ID = '0xe2469f47ab58cf9cf59f9822e3c5de4950a41c49000200000000000000000089'

export const useBPTBalApy = (): FetchState<number> => {
  const { balancer: client } = useApolloClients()
  const { fetchPrices } = useFetchPriceCtx()
  const tokenPrices = fetchPrices([MTA, WETH, BAL])
  const [balancerReward, setBalancerReward] = useFetchState<number>()

  const query = useQuery<{ balancers: { pools: { tokens: { balance: string; address: string }[] }[] }[] }>(
    gql`
      query BalancerData {
        balancers {
          id
          pools(where: { id: "0xe2469f47ab58cf9cf59f9822e3c5de4950a41c49000200000000000000000089" }) {
            tokens {
              balance
              address
            }
          }
        }
      }
    `,
    { fetchPolicy: 'cache-first', client },
  )

  const mapped = (query.data?.balancers?.[0]?.pools?.[0]?.tokens ?? [])
    .map(token => ({
      [token.address]: { balance: parseFloat(token.balance) },
    }))
    .reduce((a, b) => ({ ...a, ...b }))

  const totalLiquidity = Object.keys(mapped ?? {})
    .map(k => tokenPrices[k] * mapped[k].balance)
    .reduce((a, b) => a + b, 0)

  if (!balancerReward?.value) {
    fetch(
      'https://raw.githubusercontent.com/balancer-labs/frontend-v2/master/src/lib/utils/liquidityMining/MultiTokenLiquidityMining.json',
    ).then(raw => {
      raw.json().then(json => {
        const splicedKeys = Object.keys(json).map(k => parseInt(k.split('_')?.[1]))
        const currentWeek = `week_${Math.max(...splicedKeys)}`
        const val = json[currentWeek]?.[0]?.pools?.[POOL_ID]?.[0]?.amount
        setBalancerReward.value(val)
      })
    })
  } else {
    return {
      value: (((balancerReward.value / 7) * tokenPrices[BAL] * 365) / totalLiquidity) * 100,
    }
  }
}
