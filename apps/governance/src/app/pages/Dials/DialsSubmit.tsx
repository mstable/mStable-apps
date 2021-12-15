import React, { FC, useMemo } from 'react'
import styled from 'styled-components'

import { usePropose } from '@apps/base/context/transactions'
import { Button, Warning } from '@apps/dumb-components'
import { Interfaces, TransactionManifest } from '@apps/transaction-manifest'

import { useEmissionsController, useEmissionsData } from './context/EmissionsContext'
import { useUserDialPreferences } from './context/UserDialsContext'

enum DialView {
  Default,
  NoVotePower,
  LimitReached,
}

const SubmitContainer = styled.div`
  display: flex;
  padding: 1rem;
  border-radius: 0.875rem;
  background: ${({ theme }) => theme.color.background[0]};
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  align-items: center;

  > div:nth-child(2) {
    flex: 1;
    margin-left: 0.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  h3 {
    font-size: 1rem;
    color: ${({ theme }) => theme.color.body};
  }

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }
`

const content = {
  [DialView.Default]: {
    title: 'Changes will take effect from the next epoch',
    message: 'Your preferences will continue for future epochs until changed',
  },
  [DialView.LimitReached]: {
    title: 'Changes will take effect from the next epoch',
    message: 'You may only vote on up to 16 dials per transaction',
  },
  [DialView.NoVotePower]: {
    title: 'No voting power found',
    message: 'Stake in governance and delegate to yourself to participate actively',
  },
}

export const DialsSubmit: FC = () => {
  const propose = usePropose()
  const [emissionsController] = useEmissionsController()
  const [userDialPreferences] = useUserDialPreferences()
  const [emissionsData] = useEmissionsData()
  const votingPower = emissionsData?.user?.votePower?.simple ?? 0

  const dialView = useMemo(() => {
    if (Object.keys(userDialPreferences.changes).length === 16) return DialView.LimitReached
    if (!votingPower) return DialView.NoVotePower
    return DialView.Default
  }, [userDialPreferences, votingPower])

  return (
    <SubmitContainer>
      <Warning />
      <div>
        <h3>{content[dialView].title}</h3>
        <p>{content[dialView].message}</p>
      </div>
      {dialView !== DialView.NoVotePower && (
        <Button
          disabled={!userDialPreferences.touched}
          highlighted={userDialPreferences.touched}
          onClick={() => {
            if (!emissionsController || !Object.keys(userDialPreferences.changes).length) return

            const totalWeight = Object.values(userDialPreferences.changes).reduce((prev, weight) => prev + weight, 0)
            const weightMultiplier = 200 / totalWeight

            const voterDialWeights = Object.entries(userDialPreferences.changes)
              .filter(([, weight]) => weight > 0)
              .map(([dialId, weight]) => {
                const scaledWeight = Math.floor(weight * weightMultiplier).toString()
                return { dialId, weight: scaledWeight }
              })

            propose<Interfaces.EmissionsController, 'setVoterDialWeights'>(
              new TransactionManifest(emissionsController, 'setVoterDialWeights', [voterDialWeights], {
                present: 'Voting for weights',
                past: 'Voted on weights',
              }),
            )
          }}
        >
          Submit
        </Button>
      )}
    </SubmitContainer>
  )
}
