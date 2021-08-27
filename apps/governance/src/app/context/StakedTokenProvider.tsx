import React, { createContext, Dispatch, FC, SetStateAction, useMemo, useState } from 'react'

import { useAccount } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { providerFactory, createUseContextFn, useBlockPollingSubscription } from '@apps/hooks'
import { useStakedTokenLazyQuery, useStakedTokenQuery as useStakedTokenQueryHook } from '@apps/artifacts/graphql/staking'

import { useStakingQuery } from './StakingProvider'

interface State {
  options: { [address: string]: { asset: { address: string }; icon: { symbol: string } } }
  selected?: string
}

const stateCtx = createContext<State>(null as never)
const dispatchCtx = createContext<Dispatch<SetStateAction<string>>>(null as never)

export const StakedTokenProvider: FC = ({ children }) => {
  const [selected, setSelected] = useState<string>()
  const stakingQuery = useStakingQuery()

  return providerFactory(
    dispatchCtx,
    { value: setSelected },
    providerFactory(
      stateCtx,
      {
        value: useMemo<State>(() => {
          const data = stakingQuery.data?.stakedTokens ?? []
          const options = Object.fromEntries(
            data.map(({ id: address, stakingToken: { symbol } }) => [address, { icon: { symbol }, asset: { address, symbol } }]),
          )

          // Default to Staked MTA (not BPT)
          return { selected: selected ?? data.find(st => st.stakingToken.symbol === 'MTA')?.id, options }
        }, [selected, stakingQuery.data]),
      },
      children,
    ),
  )
}

export const useStakedToken = createUseContextFn(stateCtx)

export const useSetStakedToken = createUseContextFn(dispatchCtx)

export const useStakedTokenQuery = () => {
  const clients = useApolloClients()
  const account = useAccount()

  const { selected } = useStakedToken()

  const options = useMemo(
    () => ({ client: clients.staking, variables: { id: selected, account: account ?? '', hasAccount: !!account }, skip: !selected }),
    [account, clients, selected],
  )

  // return useBlockPollingSubscription(useStakedTokenLazyQuery, options, !selected)
  // FIXME make sure we're subscribed
  return useStakedTokenQueryHook(options)
}
