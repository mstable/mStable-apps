import { StakedToken, StakedToken__factory } from '@apps/artifacts/typechain'
import React, { createContext, Dispatch, FC, SetStateAction, useMemo, useState } from 'react'

import { useAccount, useSigner } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { providerFactory, createUseContextFn } from '@apps/hooks'
import { useStakedTokenQuery as useStakedTokenQueryHook } from '@apps/artifacts/graphql/staking'

import { useStakingQuery } from './StakingProvider'

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
      <ContractProvider>{children}</ContractProvider>,
    ),
  )
}

export const useStakedTokenContract = createUseContextFn(stakedTokenContractCtx)

export const useStakedToken = createUseContextFn(stateCtx)

export const useSetStakedToken = createUseContextFn(dispatchCtx)

export const useStakedTokenQuery = () => {
  const { staking: client } = useApolloClients()
  const account = useAccount()

  const { selected } = useStakedToken()

  const options = useMemo(
    () => ({ client, variables: { id: selected, account: account ?? '', hasAccount: !!account }, skip: !selected, pollInterval: 15e3 }),
    [account, client, selected],
  )

  return useStakedTokenQueryHook(options)
}
