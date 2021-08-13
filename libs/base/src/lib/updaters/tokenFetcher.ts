import { useEffect } from 'react'
import { QueryHookOptions } from '@apollo/client'
import { AllTokensQuery, AllTokensQueryVariables, useAllTokensQuery as useAllTokensProtocolQuery } from '@apps/artifacts/graphql/protocol'
import { useFeederTokensQuery, FeederTokensQuery, FeederTokensQueryVariables } from '@apps/artifacts/graphql/feeders'

import { useNetwork } from '../context/NetworkProvider'
import { useTokensDispatch } from '../context/TokensProvider'
import { useFeederTokensPolygonQuery } from '@apps/artifacts/graphql/feeders-polygon'

const options = {
  fetchPolicy: 'network-only',
} as QueryHookOptions

/**
 * Updater to one-time fetch all ERC20 tokens from the subgraph.
 */
export const TokenFetcher = (): null => {
  const network = useNetwork()
  const { setFetched } = useTokensDispatch()

  const protocolQuery = useAllTokensProtocolQuery(options as QueryHookOptions<AllTokensQuery, AllTokensQueryVariables>)
  // const feedersQuery = useFeederTokensQuery({
  //   ...options,
  //   skip: !Object.prototype.hasOwnProperty.call(network.gqlEndpoints, 'feeders'),
  // } as QueryHookOptions<FeederTokensQuery, FeederTokensQueryVariables>)
  const feedersQuery = useFeederTokensPolygonQuery({
    ...options,
    skip: !Object.prototype.hasOwnProperty.call(network.gqlEndpoints, 'feedersPolygon'),
  } as QueryHookOptions<FeederTokensQuery, FeederTokensQueryVariables>)

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
