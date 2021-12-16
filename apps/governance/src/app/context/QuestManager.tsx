import React, { createContext, FC, useMemo } from 'react'

import { QuestManager, QuestManager__factory } from '@apps/artifacts/typechain'
import { useSigner } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { providerFactory, createUseContextFn } from '@apps/context-utils'
import { useQuestsQuery } from '@apps/artifacts/graphql/staking'

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
