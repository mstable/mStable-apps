import React, { FC } from 'react'
import { useToggle } from 'react-use'
import useSound from 'use-sound'
import { getUnixTime } from 'date-fns'

import { useQuestQuery as useQuestbookQuestQuery, useUpdateQuestMutation } from '@apps/artifacts/graphql/questbook'
import { useAccountQuery, useQuestQuery } from '@apps/artifacts/graphql/staking'
import { useAccount } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { usePropose } from '@apps/base/context/transactions'
import { Button, Tooltip } from '@apps/dumb-components'
import { Interfaces, TransactionManifest } from '@apps/transaction-manifest'

import { useQuestManagerContract } from '../../context/QuestManager'

// @ts-ignore
import bleep28 from '../../../assets/bleeps_28.mp3'
// @ts-ignore
import bleep29 from '../../../assets/bleeps_29.mp3'

const nowUnix = getUnixTime(new Date())

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
    pollInterval: 15e3,
  })
  const questbookQuest = questbookQuery.data?.quest
  const ethereumId = questbookQuest?.ethereumId?.toString()

  const questQuery = useQuestQuery({
    client: clients.staking,
    variables: { id: ethereumId as string },
    skip: !ethereumId,
  })

  const accountQuery = useAccountQuery({
    client: clients.staking,
    variables: { id: account ?? '' },
    skip: !account,
    pollInterval: 15e3,
  })

  const claimed = accountQuery.data?.account?.completedQuests?.find(c => c.quest.id === questbookQuest?.ethereumId?.toString())
  const readyToClaim = !claimed && questbookQuest?.userQuest?.complete
  const questExpired = questQuery.data?.quest && questQuery.data.quest.expiry > nowUnix

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
    <Button highlighted onClick={handleClaimQuest} disabled={isPending || questExpired || !ethereumId}>
      {ethereumId ? (
        questExpired ? (
          'Expired'
        ) : (
          'Claim'
        )
      ) : (
        <Tooltip tip="This quest is not available to complete on-chain yet, but it will be in the near future">Claim</Tooltip>
      )}
    </Button>
  ) : (
    <Button highlighted onClick={handleRefresh} disabled={isPending}>
      {isPending ? 'Checking...' : 'Check status'}
    </Button>
  )
}
