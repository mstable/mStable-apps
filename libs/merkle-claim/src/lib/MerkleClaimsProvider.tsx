import React, { createContext, FC, useMemo } from 'react'

import { useApolloClients } from '@apps/base/context/apollo'
import { BigDecimal } from '@apps/bigdecimal'
import { FetchState } from '@apps/hooks'
import { useAccount } from '@apps/base/context/account'
import { useMerkleDropAccountsQuery } from '@apps/artifacts/graphql/merkle-drop'

import { MerkleClaims } from './types'

export const merkleClaimsCtx = createContext<FetchState<MerkleClaims>>(null as never)

export const MerkleClaimsProvider: FC = ({ children }) => {
  const account = useAccount()
  const { merkleDrop: client } = useApolloClients()
  const query = useMerkleDropAccountsQuery({ variables: { account: account as string }, skip: !account, client })

  const merkleClaims = useMemo<FetchState<MerkleClaims>>(() => {
    if (!query.data || query.loading) return { fetching: true }

    const value: MerkleClaims = Object.fromEntries(
      query.data.accounts.map(
        ({
          merkleDrop: {
            id: merkleDrop,
            token: { address: token },
          },
          claims,
        }) => {
          const tranches = claims.map(({ amount, tranche: { trancheId, uri } }) => ({
            amount: BigDecimal.parse(amount),
            trancheId,
            uri,
          }))

          const totalUnclaimed = tranches.reduce((prev, { amount }) => prev.add(amount), BigDecimal.ZERO)

          return [merkleDrop, { address: merkleDrop, token, tranches, totalUnclaimed }]
        },
      ),
    )

    return { value }
  }, [query])

  return <merkleClaimsCtx.Provider value={merkleClaims}>{children}</merkleClaimsCtx.Provider>
}
