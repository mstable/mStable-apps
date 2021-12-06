import React, { FC } from 'react'
import { usePreviousDistinct } from 'react-use'
import styled from 'styled-components'

import { usePropose } from '@apps/base/context/transactions'
import { Button, Warning } from '@apps/dumb-components'
import { Interfaces, TransactionManifest } from '@apps/transaction-manifest'

import { useEmissionsController } from './context/EmissionsContext'
import { useUserDialPreferences } from './context/UserDialsContext'

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

export const DialsSubmit: FC = () => {
  const propose = usePropose()
  const [emissionsController] = useEmissionsController()

  const [userDialPreferences] = useUserDialPreferences()
  const userDialPreferencesPrev = usePreviousDistinct(userDialPreferences.changes)
  const preferencesChanged = JSON.stringify(userDialPreferences) !== JSON.stringify(userDialPreferencesPrev)

  return (
    <SubmitContainer>
      <Warning />
      {Object.keys(userDialPreferences).length ? (
        <>
          <div>
            <h3>Changes will take effect from the next epoch</h3>
            <p>Your preferences will continue for future epochs until changed</p>
          </div>
          <Button
            disabled={!preferencesChanged}
            highlighted={preferencesChanged}
            onClick={() => {
              if (!emissionsController || !Object.keys(userDialPreferences.changes).length) return

              const totalWeight = Object.values(userDialPreferences.changes).reduce((prev, weight) => prev + weight, 0)
              const weightMultiplier = 200 / totalWeight

              const voterDialWeights = Object.entries(userDialPreferences.changes)
                .filter(([, weight]) => weight > 0)
                .map(([dialId, weight]) => {
                  const scaledWeight = Math.floor(weight * weightMultiplier)
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
        </>
      ) : (
        <div>
          <h3>No voting power found</h3>
          <p>Stake in governance and delegate to yourself to participate actively</p>
        </div>
      )}
    </SubmitContainer>
  )
}
