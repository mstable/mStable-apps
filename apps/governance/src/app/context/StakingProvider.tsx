import React, { FC, useMemo, createContext, useContext } from 'react'
import { useAccount } from '@apps/base/context/account'
import { useBlockPollingSubscription } from '@apps/hooks'
import { StakingQueryHookResult, useStakingLazyQuery } from '@apps/artifacts/graphql/staking'
import { QuestsQueryHookResult, useQuestsLazyQuery, useQuestsQuery } from '@apps/artifacts/graphql/questbook'
import { GovernanceV1QueryHookResult, useGovernanceV1LazyQuery, useGovernanceV1Query } from '@apps/artifacts/graphql/governance-v1'
import { useApolloClients } from '@apps/base/context/apollo'

const stakingCtx = createContext<StakingQueryHookResult>(null as never)
const questbookCtx = createContext<QuestsQueryHookResult>(null as never)
const governanceV1Ctx = createContext<GovernanceV1QueryHookResult>(null as never)

export const useGovernanceOldQuery = () => useContext(governanceV1Ctx)

export const useStakingQuery = () => useContext(stakingCtx)

export const useQuestbookQuery = () => useContext(questbookCtx)

export const StakingProvider: FC = ({ children }) => {
  const apollo = useApolloClients()
  const account = useAccount()

  const options = useMemo<{
    staking: Parameters<typeof useStakingLazyQuery>[0]
    questbook: Parameters<typeof useQuestsLazyQuery>[0]
    // governanceV1: Parameters<typeof useGovernanceV1LazyQuery>[0]
  }>(() => {
    return {
      staking: {
        client: apollo.staking,
      },
      questbook: {
        variables: { userId: account ?? '', hasUser: !!account },
        client: apollo.questbook,
      },
      // governanceV1: {
      //   variables: { account: account ?? '' },
      //   client: apollo.governanceV1,
      // },
    }
  }, [account, apollo])

  const stakingSub = useBlockPollingSubscription(useStakingLazyQuery, options.staking) as unknown as StakingQueryHookResult
  const questbookSub = useQuestsQuery(options.questbook) // maybe this should use block polling too
  // const governanceSub = useGovernanceV1Query(options.governanceV1)

  return (
    <stakingCtx.Provider value={stakingSub}>
      <questbookCtx.Provider value={questbookSub}>
        {children}
        {/* <governanceV1Ctx.Provider value={governanceSub}>{children}</governanceV1Ctx.Provider> */}
      </questbookCtx.Provider>
    </stakingCtx.Provider>
  )
}
