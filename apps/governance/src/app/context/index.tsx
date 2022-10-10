import { useMemo } from 'react'

import { useQuestsQuery } from '@apps/artifacts/graphql/questbook'
import { useStakingQuery as useStakingQueryHook } from '@apps/artifacts/graphql/staking'
import { useAccount } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { composedComponent } from '@apps/react-utils'
import { useIdle } from 'react-use'

import { DelegateeListsProvider } from './DelegateeLists'
import { QuestManagerProvider } from './QuestManager'
import { StakedTokenProvider, StakedTokenQueryUpdater } from './StakedToken'

import type { FC } from 'react'

const StakingAccountQueryUpdater: FC = () => {
  const clients = useApolloClients()
  const account = useAccount()
  const idle = useIdle(31e3)
  const pollInterval = useMemo(() => (idle ? 0 : 30e3), [idle])

  // Poll and cache
  useStakingQueryHook({
    client: clients.staking,
    pollInterval,
  })
  useQuestsQuery({
    variables: { userId: account ?? '', hasUser: !!account },
    client: clients.questbook,
    pollInterval,
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
