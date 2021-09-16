import React, { createContext, Dispatch, FC, SetStateAction, useMemo, useState } from 'react'

import { useAccount, useSigner } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { providerFactory, createUseContextFn } from '@apps/hooks'
import { useGovernanceV1Query as useGovernanceV1QueryHook } from '@apps/artifacts/graphql/governance-v1'

import { useGovernanceOldQuery } from './StakingProvider'

interface State {
  lockTime?: string
  value?: string
}

const governanceV1Ctx = createContext<State | undefined>(undefined)

export const GovernanceV1Provider: FC = ({ children }) => {
  const governanceQuery = useGovernanceOldQuery()

  return providerFactory(
    governanceV1Ctx,
    {
      value: useMemo<State>(() => {
        const data = governanceQuery?.data?.userLockups ?? []
        return { lockTime: data?.[0]?.lockTime, value: data?.[0]?.value }
      }, [governanceQuery?.data]),
    },
    children,
  )
}

export const useGovernanceV1Query = () => {
  const { governanceV1: client } = useApolloClients()
  const account = useAccount()

  const options = useMemo(() => ({ client, variables: { account: account ?? '' } }), [account, client])

  return useGovernanceV1QueryHook(options)
}
