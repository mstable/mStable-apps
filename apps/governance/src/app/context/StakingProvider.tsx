import React, { FC, useMemo, createContext, useContext } from 'react'
import { useAccount } from '@apps/base/context/account'
import { StakingQueryHookResult, useStakingQuery } from '@apps/artifacts/graphql/staking'
import { QuestsQueryHookResult, useQuestsLazyQuery, useQuestsQuery } from '@apps/artifacts/graphql/questbook'
import { useApolloClients } from '@apps/base/context/apollo'

const stakingCtx = createContext<StakingQueryHookResult>(null as never)
const questbookCtx = createContext<QuestsQueryHookResult>(null as never)

export const useStakingQueryCtx = () => useContext(stakingCtx)

export const useQuestbookQuery = () => useContext(questbookCtx)

export const StakingProvider: FC = ({ children }) => {
  const clients = useApolloClients()
  const account = useAccount()

  const options = useMemo<{
    staking: Parameters<typeof useStakingQuery>[0]
    questbook: Parameters<typeof useQuestsLazyQuery>[0]
  }>(() => {
    return {
      staking: {
        client: clients.staking,
        pollInterval: 30e3,
      },
      questbook: {
        variables: { userId: account ?? '', hasUser: !!account },
        client: clients.questbook,
        pollInterval: 60e3,
      },
    }
  }, [account, clients])

  const stakingSub = useStakingQuery(options.staking)
  const questbookSub = useQuestsQuery(options.questbook)

  return (
    <stakingCtx.Provider value={stakingSub}>
      <questbookCtx.Provider value={questbookSub}>{children}</questbookCtx.Provider>
    </stakingCtx.Provider>
  )
}
