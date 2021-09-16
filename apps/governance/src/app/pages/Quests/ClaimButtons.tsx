import React, { FC } from 'react'
import { useToggle } from 'react-use'
import useSound from 'use-sound'

import { useQuestQuery as useQuestbookQuestQuery, useUpdateQuestMutation } from '@apps/artifacts/graphql/questbook'
import { useAccountQuery } from '@apps/artifacts/graphql/staking'
import { useAccount } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { usePropose } from '@apps/base/context/transactions'
import { Button } from '@apps/components/core'
import { Interfaces, TransactionManifest } from '@apps/transaction-manifest'

import { useQuestManagerContract } from '../../context/QuestManagerProvider'

// @ts-ignore
import bleep28 from '../../../assets/bleeps_28.mp3'
// @ts-ignore
import bleep29 from '../../../assets/bleeps_29.mp3'

export const ClaimButtons: FC<{ questId: string }> = ({ questId }) => {
  const account = useAccount()
  const clients = useApolloClients()

  const [isPending, toggleIsPending] = useToggle(false)
  const questManagerContract = useQuestManagerContract()
  const propose = usePropose()

  const [playBleep28] = useSound(bleep28, { volume: 0.2 })
  const [playBleep29] = useSound(bleep29, { volume: 0.2 })

  const [updateQuest] = useUpdateQuestMutation({
    client: clients.questbook,
    variables: { questId, userId: account, hasUser: !!account },
  })

  const questbookQuery = useQuestbookQuestQuery({
    client: clients.questbook,
    variables: { questId, userId: account ?? '', hasUser: !!account },
  })
  const questbookQuest = questbookQuery.data?.quest

  const accountQuery = useAccountQuery({
    client: clients.staking,
    variables: { id: account ?? '' },
    skip: !account,
  })

  const claimed = accountQuery.data?.account?.completedQuests?.find(c => c.quest.id === questbookQuest?.ethereumId?.toString())
  const readyToClaim = !claimed && questbookQuest?.userQuest?.complete

  const handleClaimQuest = () => {
    if (
      isPending ||
      !questManagerContract ||
      !questbookQuest ||
      typeof questbookQuest.ethereumId !== 'number' ||
      !questbookQuest.userQuest?.signature
    )
      return

    propose(
      new TransactionManifest<Interfaces.QuestManager, 'completeUserQuests'>(
        questManagerContract,
        'completeUserQuests',
        [account, [questbookQuest.ethereumId], questbookQuest.userQuest.signature],
        {
          present: 'Complete quest',
          past: 'Completed quest',
        },
      ),
    )
  }

  const handleRefresh = () => {
    if (isPending) return

    playBleep28()
    toggleIsPending(true)
    updateQuest()
      .catch(error => {
        console.error(error)
      })
      .finally(() => {
        toggleIsPending(false)
        playBleep29()
      })
  }

  return claimed ? (
    <Button disabled>Claimed</Button>
  ) : readyToClaim ? (
    <Button highlighted onClick={handleClaimQuest}>
      Claim
    </Button>
  ) : (
    <Button highlighted onClick={handleRefresh}>
      {isPending ? 'Checking...' : 'Check status'}
    </Button>
  )
}
