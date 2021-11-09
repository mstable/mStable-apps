import React, { FC } from 'react'

import { useQueueOptInMutation, useQueueOptOutMutation, useUserQuery } from '@apps/artifacts/graphql/questbook'
import { useAccount, useSigner } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { useAddErrorNotification, useAddSuccessNotification } from '@apps/base/context/notifications'
import { Button, Tooltip } from '@apps/dumb-components'

export const QueueOptInOutButton: FC = () => {
  const userId = useAccount() ?? ''
  const { questbook: client } = useApolloClients()
  const signer = useSigner()

  const errorNotification = useAddErrorNotification()
  const successNotification = useAddSuccessNotification()

  const questbookUserQuery = useUserQuery({
    client,
    variables: { userId },
    skip: !userId,
  })

  const [optIn] = useQueueOptInMutation({ client })
  const [optOut] = useQueueOptOutMutation({ client })

  const handleOptIn = () => {
    if (!signer || !userId) return

    signer
      .signMessage('I am joining the queue for automatic quest completion')
      .then(signature => {
        optIn({ variables: { userId, signature } })
          .then(() => {
            successNotification('Joined the queue for automatic quest completion')
          })
          .catch(error => {
            errorNotification('Error opting in', error.message)
          })
      })
      .catch(error => {
        errorNotification('Error signing message', error.message)
      })
  }

  const handleOptOut = () => {
    if (!signer || !userId) return

    signer
      .signMessage('I am leaving the queue for automatic quest completion')
      .then(signature => {
        optOut({ variables: { userId, signature } })
          .then(() => {
            successNotification('Left the queue for automatic quest completion')
          })
          .catch(error => {
            errorNotification('Error opting out', error.message)
          })
      })
      .catch(error => {
        errorNotification('Error signing message', error.message)
      })
  }

  return questbookUserQuery.data?.user?.optInQueue ? (
    <Button highlighted onClick={handleOptOut}>
      <Tooltip tip="We are submitting your completed quests at regular intervals, but you can opt out of this">Auto-submit</Tooltip>
    </Button>
  ) : (
    <Button highlighted onClick={handleOptIn}>
      <Tooltip tip="Sign a message and we'll submit your completed quests at regular intervals, saving you gas" hideIcon>
        Submit quests
      </Tooltip>
    </Button>
  )
}
