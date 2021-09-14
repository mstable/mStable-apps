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

export const StakedTokenProvider: FC = ({ children }) => {
  const signer = useSigner()
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
      providerFactory(
        stakedTokenContractCtx,
        {
          value: useMemo(() => {
            const data = stakingQuery.data?.stakedTokens ?? []
            return signer ? StakedToken__factory.connect(selected ?? data.find(st => st.stakingToken.symbol === 'MTA')?.id, signer) : null
          }, [stakingQuery.data, signer, selected]),
        },
        children,
      ),
    ),
  )
}

export const useStakedTokenContract = createUseContextFn(stakedTokenContractCtx)

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

  return useStakedTokenQueryHook(options)
}
