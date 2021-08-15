import { useEffect, useMemo } from 'react'
import { useAllTokensQuery as useAllTokensProtocolQuery } from '@apps/artifacts/graphql/protocol'
import { useFeederTokensQuery } from '@apps/artifacts/graphql/feeders'

import { useApolloClients } from '@apps/base/context/apollo'
import { useNetwork } from '../context/NetworkProvider'
import { useTokensDispatch } from '../context/TokensProvider'

export const TokenFetcher = (): null => {
  const clients = useApolloClients()
  const network = useNetwork()
  const { setFetched } = useTokensDispatch()

  const options = useMemo(() => {
    return {
      protocol: {
        client: clients.protocol,
      },
      feeders: {
        client: clients.feeders,
      },
      // staking: {
      //   client: clients.staking,
      // },
      // stakingRewards: {
      //   client: clients.stakingRewards,
      // },
    }
  }, [clients, network])

  const protocolQuery = useAllTokensProtocolQuery(options.protocol)
  const feedersQuery = useFeederTokensQuery(options.feeders)

  const protocolFetched = protocolQuery.data?.tokens ?? []
  const feedersFetched = feedersQuery.data?.feederPools ?? []

  // Sub/unsub when the list of tokens changes from what's subscribed.
  useEffect(() => {
    if (protocolFetched.length > 0) {
      setFetched(protocolFetched)
    }
    if (feedersFetched.length > 0) {
      setFetched(feedersFetched.flatMap(fp => [fp.token, fp.fasset]))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [protocolFetched.length, feedersFetched.length])

  return null
}
