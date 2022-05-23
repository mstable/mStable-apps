import { createContext, useMemo } from 'react'

import { useQuestsQuery } from '@apps/artifacts/graphql/staking'
import { QuestManager__factory } from '@apps/artifacts/typechain'
import { useSigner } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { createUseContextFn, providerFactory } from '@apps/context-utils'

import type { QuestManager } from '@apps/artifacts/typechain'
import type { FC } from 'react'

const questManagerContractCtx = createContext<QuestManager | undefined>(undefined)

export const QuestManagerProvider: FC = ({ children }) => {
  const signer = useSigner()
  const clients = useApolloClients()
  const questsQuery = useQuestsQuery({ client: clients.staking, canonizeResults: true })

  const questManagerAddress = questsQuery.data?.questManagers[0]?.id

  return providerFactory(
    questManagerContractCtx,
    {
      value: useMemo(
        () => (signer && questManagerAddress ? QuestManager__factory.connect(questManagerAddress, signer) : null),
        [signer, questManagerAddress],
      ),
    },
    children,
  )
}

export const useQuestManagerContract = createUseContextFn(questManagerContractCtx)
