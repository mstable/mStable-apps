import { FC } from 'react'

import { useQuestsQuery } from '@apps/artifacts/graphql/questbook'
import { useStakingQuery as useStakingQueryHook } from '@apps/artifacts/graphql/staking'
import { useAccount } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { composedComponent } from '@apps/react-utils'

import { DelegateeListsProvider } from './DelegateeLists'
import { QuestManagerProvider } from './QuestManager'
import { StakedTokenProvider, StakedTokenQueryUpdater } from './StakedToken'

const StakingAccountQueryUpdater: FC = () => {
  const clients = useApolloClients()
  const account = useAccount()

  // Poll and cache
  useStakingQueryHook({
    client: clients.staking,
    pollInterval: 30e3,
  })
  useQuestsQuery({
    variables: { userId: account ?? '', hasUser: !!account },
    client: clients.questbook,
    pollInterval: 60e3,
  })

  return null
}

export const useStakingQuery = () => {
  const clients = useApolloClients()
  return useStakingQueryHook({
    client: clients.staking,
    fetchPolicy: 'cache-only',
  })
}

const Providers = composedComponent(DelegateeListsProvider, QuestManagerProvider, StakedTokenProvider)

export const GovernanceContext: FC = ({ children }) => (
  <Providers>
    {children}
    <StakingAccountQueryUpdater />
    <StakedTokenQueryUpdater />
  </Providers>
)
