import { StakedToken, StakedToken__factory } from '@apps/artifacts/typechain'
import React, { createContext, Dispatch, FC, SetStateAction, useMemo, useState } from 'react'

import { useAccount, useSigner } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { providerFactory, createUseContextFn } from '@apps/context-utils'
import { useStakedTokenQuery as useStakedTokenQueryHook, useStakingQuery } from '@apps/artifacts/graphql/staking'

interface State {
  options: { [address: string]: { asset: { address: string }; icon: { symbol: string } } }
  selected?: string
}

const stateCtx = createContext<State>(null as never)
const dispatchCtx = createContext<Dispatch<SetStateAction<string>>>(null as never)
const stakedTokenContractCtx = createContext<StakedToken | undefined>(undefined)

const ContractProvider: FC = ({ children }) => {
  const signer = useSigner()
  const { selected } = useStakedToken()
  const value = useMemo(() => (signer && selected ? StakedToken__factory.connect(selected, signer) : null), [signer, selected])
  return providerFactory(stakedTokenContractCtx, { value }, children)
}

export const StakedTokenProvider: FC = ({ children }) => {
  const clients = useApolloClients()
  const stakingQuery = useStakingQuery({
    client: clients.staking,
    fetchPolicy: 'cache-only',
    nextFetchPolicy: 'cache-only',
  })

  const [selected, setSelected] = useState<string>()

  return providerFactory(
    dispatchCtx,
    { value: setSelected },
    providerFactory(
      stateCtx,
      {
        value: useMemo<State>(() => {
          const data = stakingQuery.data?.stakedTokens ?? []
          if (!data.every(st => st?.stakingToken?.symbol)) return { options: {} }

          const options = Object.fromEntries(
            data.map(({ id: address, stakingToken: { symbol } }) => [address, { icon: { symbol }, asset: { address, symbol } }]),
          )

          // Default to Staked MTA (not BPT)
          return { selected: selected ?? data.find(st => st.stakingToken.symbol === 'MTA')?.id, options }
        }, [selected, stakingQuery.data]),
      },
      <ContractProvider>{children}</ContractProvider>,
    ),
  )
}

export const StakedTokenQueryUpdater: FC = () => {
  const clients = useApolloClients()
  const account = useAccount()
  const { selected } = useStakedToken()

  // Poll and cache
  useStakedTokenQueryHook({
    client: clients.staking,
    variables: { id: selected, account: account ?? '', hasAccount: !!account },
    skip: !selected,
    pollInterval: 30e3,
  })

  return null
}

export const useStakedTokenContract = createUseContextFn(stakedTokenContractCtx)

export const useStakedToken = createUseContextFn(stateCtx)

export const useSetStakedToken = createUseContextFn(dispatchCtx)

export const useStakedTokenQuery = () => {
  const clients = useApolloClients()
  const account = useAccount()

  const { selected } = useStakedToken()

  return useStakedTokenQueryHook({
    client: clients.staking,
    variables: { id: selected, account: account ?? '', hasAccount: !!account },
    skip: !selected,
    fetchPolicy: 'cache-only',
    nextFetchPolicy: 'cache-only',
  })
}
