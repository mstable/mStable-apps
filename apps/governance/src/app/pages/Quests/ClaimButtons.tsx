import { useQuestQuery as useQuestbookQuestQuery, useUpdateQuestMutation } from '@apps/artifacts/graphql/questbook'
import { useAccountQuery, useQuestQuery } from '@apps/artifacts/graphql/staking'
import { useAccount } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { useAddQuestNotification } from '@apps/base/context/notifications'
import { usePropose } from '@apps/base/context/transactions'
import { useSound } from '@apps/browser-settings'
import { Button, Tooltip } from '@apps/dumb-components'
import { useIdlePollInterval } from '@apps/hooks'
import { TransactionManifest } from '@apps/transaction-manifest'
import { getUnixTime } from 'date-fns'
import { useToggle } from 'react-use'

// @ts-ignore
import bleep28 from '../../../assets/bleeps_28.mp3'
// @ts-ignore
import bleep29 from '../../../assets/bleeps_29.mp3'
import { useQuestManagerContract } from '../../context/QuestManager'

import type { Interfaces } from '@apps/transaction-manifest'
import type { FC } from 'react'

const nowUnix = getUnixTime(new Date())

export const ClaimButtons: FC<{ questId: string }> = ({ questId }) => {
  const account = useAccount()
  const clients = useApolloClients()
  const addQuestNotification = useAddQuestNotification()
  const pollInterval = useIdlePollInterval(15e3)

  const [isPending, toggleIsPending] = useToggle(false)
  const questManagerContract = useQuestManagerContract()
  const propose = usePropose()

  const [playBleep28] = useSound(bleep28, { volume: 0.2 })
  const [playBleep29] = useSound(bleep29, { volume: 0.2 })

  const [updateQuest] = useUpdateQuestMutation({
    client: clients.questbook,
    variables: { questId, userId: account, hasUser: !!account },
    onCompleted: data => {
      const { userQuest, title, objectives } = data.updateQuest
      if (userQuest) return

      const nowUnix = getUnixTime(Date.now())

      if (userQuest.completedAt && nowUnix - userQuest.completedAt < 30) {
        addQuestNotification(title)
      }

      userQuest.objectives
        .filter(obj => obj.completedAt && nowUnix - obj.completedAt < 30)
        .forEach(obj => {
          const obj_ = objectives.find(_obj => _obj.id === obj.id)
          if (obj_) addQuestNotification(obj_.title, obj_.points)
        })
    },
  })

  const questbookQuery = useQuestbookQuestQuery({
    client: clients.questbook,
    variables: { questId, userId: account ?? '', hasUser: !!account },
    pollInterval,
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
    pollInterval,
    nextFetchPolicy: 'cache-only',
  })

  const claimed = accountQuery.data?.account?.completedQuests?.find(c => c.quest.id === questbookQuest?.ethereumId?.toString())
  const readyToClaim = !claimed && questbookQuest?.userQuest?.complete
  const questExpired = questQuery.data?.quest && questQuery.data.quest.expiry < nowUnix

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
