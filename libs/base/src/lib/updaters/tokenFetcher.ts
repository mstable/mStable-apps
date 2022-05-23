import { useEffect, useMemo } from 'react'

import { useFeederTokensQuery } from '@apps/artifacts/graphql/feeders'
import { useAllTokensQuery as useAllTokensProtocolQuery } from '@apps/artifacts/graphql/protocol'
import { useTokensQuery as useStakingTokensQuery } from '@apps/artifacts/graphql/staking'
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { useApolloClients } from '@apps/base/context/apollo'

import { useTokensDispatch } from '../context/TokensProvider'

export const TokenFetcher = (): null => {
  const clients = useApolloClients()
  const { setFetched } = useTokensDispatch()

  const options = useMemo(() => {
    return {
      protocol: {
        client: clients.protocol,
      },
      feeders: {
        client: clients.feeders,
      },
      staking: {
        client: clients.staking,
      },
      // stakingRewards: {
      //   client: clients.stakingRewards,
      // },
    }
  }, [clients])

  const protocolQuery = useAllTokensProtocolQuery(options.protocol)
  const feedersQuery = useFeederTokensQuery(options.feeders)
  const stakingQuery = useStakingTokensQuery(options.staking)

  const protocolFetched = protocolQuery.data?.tokens ?? []
  const feedersFetched = feedersQuery.data?.feederPools ?? []
  const stakingFetched = stakingQuery.data?.tokens ?? []

  // Sub/unsub when the list of tokens changes from what's subscribed.
  useEffect(() => {
    if (protocolFetched.length > 0) {
      setFetched(protocolFetched)
    }
    if (feedersFetched.length > 0) {
      setFetched(feedersFetched.flatMap(fp => [fp.token, fp.fasset]))
    }
    if (stakingFetched.length > 0) {
      setFetched(stakingFetched)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [protocolFetched.length, feedersFetched.length, stakingFetched.length])

  return null
}
