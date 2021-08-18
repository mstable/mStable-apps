import React, { FC, useMemo } from 'react'
import { useAccount } from '@apps/base/context/account'
import { useBlockPollingSubscription } from '@apps/hooks'
import { useStakingLazyQuery } from '@apps/artifacts/graphql/staking'
import { useApolloClients } from '@apps/base/context/apollo'
import { useQuestsLazyQuery, useQuestsQuery } from '@apps/artifacts/graphql/questbook'

export const StakingProvider: FC = ({ children }) => {
  const apollo = useApolloClients()
  const account = useAccount()

  const options = useMemo<{
    staking: Parameters<typeof useStakingLazyQuery>[0]
    questbook: Parameters<typeof useQuestsLazyQuery>[0]
  }>(() => {
    const baseOptions = { variables: { account: account ?? '', hasAccount: !!account } }
    return {
      staking: {
        ...baseOptions,
        client: apollo.staking,
      },
      questbook: {
        ...baseOptions,
        client: apollo.questbook,
      },
    }
  }, [account, apollo])

  const stakingSub = useBlockPollingSubscription(useStakingLazyQuery, options.staking)
  const questbookSub = useQuestsQuery(options.questbook) // maybe this should use block polling too

  // TODO use the data
  ;(window as any).Staking = stakingSub.data
  ;(window as any).Questbook = questbookSub.data

  return <>{children}</>
}
