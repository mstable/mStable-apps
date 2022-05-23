import { createContext, useMemo } from 'react'

import { useMerkleDropAccountsQuery } from '@apps/artifacts/graphql/merkle-drop'
import { useAccount } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

import type { FetchState } from '@apps/types'
import type { FC } from 'react'

import type { MerkleClaims } from './types'

export const merkleClaimsCtx = createContext<FetchState<MerkleClaims>>(null as never)

export const MerkleClaimsProvider: FC = ({ children }) => {
  const account = useAccount()
  const { merkleDrop: client } = useApolloClients()
  const query = useMerkleDropAccountsQuery({ variables: { account: account as string }, skip: !account, client })

  const merkleClaims = useMemo<FetchState<MerkleClaims>>(() => {
    if (!query.data) return { fetching: true }

    const value: MerkleClaims = Object.fromEntries(
      query.data.accounts.map(({ merkleDrop: { id: merkleDrop, token }, claims }) => {
        const tranches = claims.map(({ amount, tranche: { trancheId, uri } }) => ({
          amount: BigNumber.from(amount),
          trancheId,
          uri,
        }))

        const totalUnclaimed = tranches.reduce((prev, { amount }) => prev.add(amount), BigNumber.from(0))
        const totalUnclaimedSimple = parseFloat(formatUnits(totalUnclaimed))

        return [merkleDrop, { address: merkleDrop, token, tranches, totalUnclaimed, totalUnclaimedSimple }]
      }),
    )

    return { value }
  }, [query.data])

  return <merkleClaimsCtx.Provider value={merkleClaims}>{children}</merkleClaimsCtx.Provider>
}
