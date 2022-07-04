import { useCallback } from 'react'

import { Button } from '@apps/dumb-components'
import { ViewportWidth } from '@apps/theme'
import styled from 'styled-components'

import { useEmissionsData } from './context/EmissionsContext'
import { useDisabledDialsWithVotes, useEpochWeekNumber } from './context/EpochContext'
import { useUserDialPreferences } from './context/UserDialsContext'
import { useSystemView } from './context/ViewOptionsContext'
import { DialsSubmit } from './DialsSubmit'
import { DialTable } from './DialTable'

import type { FC } from 'react'

const Buttons = styled.div`
  display: flex;
  position: absolute;
  right: 0.75rem;
  top: -2.5rem;
  gap: 0.25rem;

  @media (min-width: ${ViewportWidth.s}) {
    top: 0.75rem;
  }
`
const StyledButton = styled(Button)`
  height: 2.125rem;
  padding: 0.25rem 0.75rem;
  display: flex;
  align-items: center;
  background: ${({ highlighted, theme }) => !highlighted && theme.color.background[0]};
  border: ${({ highlighted, theme }) => !highlighted && `1px solid ${theme.color.defaultBorder}`};
`

const DialButtons: FC = () => {
  const [isSystemView, toggleSystemView] = useSystemView()
  const [, dispatchUserDialPreferences] = useUserDialPreferences()
  const [emissionsData] = useEmissionsData()
  const isDelegating = emissionsData?.user?.isDelegatee
  const [epochWeekNumber = emissionsData?.lastEpochWeekNumber] = useEpochWeekNumber()
  const isPreviousEpoch = epochWeekNumber !== emissionsData?.lastEpochWeekNumber
  const disabledDialsWithVotes = useDisabledDialsWithVotes()

  const handleVoteClick = useCallback(() => {
    if (isSystemView && !isPreviousEpoch && disabledDialsWithVotes.length > 0) {
      for (const dial of disabledDialsWithVotes) {
        dispatchUserDialPreferences({ type: 'SET_DIAL', payload: { dialId: dial.dialId, value: 0 } })
      }
    } else {
      dispatchUserDialPreferences({ type: 'RESET' })
    }
    toggleSystemView()
  }, [disabledDialsWithVotes, dispatchUserDialPreferences, isPreviousEpoch, isSystemView, toggleSystemView])

  return (
    <Buttons>
      {!isSystemView && !isDelegating && !isPreviousEpoch && (
        <StyledButton
          scale={0.875}
          highlighted={isSystemView}
          onClick={() => {
            dispatchUserDialPreferences({ type: 'RESET' })
          }}
        >
          Reset
        </StyledButton>
      )}
      <StyledButton scale={0.875} highlighted={isSystemView} onClick={handleVoteClick}>
        {isSystemView ? (isDelegating ? 'Delegatee weight' : isPreviousEpoch ? 'View user weight' : 'Vote on weight') : 'Back'}
      </StyledButton>
    </Buttons>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.875rem;
  position: relative;
  gap: 0.5rem;
  background: ${({ theme }) => theme.color.background[1]};
  padding: 0.75rem;
  margin-top: 2rem;

  tbody {
    background: ${({ theme }) => theme.color.background[0]};

    h3 {
      font-weight: 500;
    }
  }

  @media (min-width: ${ViewportWidth.s}) {
    margin-top: 0;
  }
`

export const DialView: FC = () => {
  const [isSystemView] = useSystemView()
  const [emissionsData] = useEmissionsData()
  const [epochWeekNumber = emissionsData?.lastEpochWeekNumber] = useEpochWeekNumber()
  const isPreviousEpoch = epochWeekNumber !== emissionsData?.lastEpochWeekNumber
  return (
    <Container>
      <DialButtons />
      <DialTable />
      {!isSystemView && !isPreviousEpoch && !emissionsData?.user?.isDelegatee && <DialsSubmit />}
    </Container>
  )
}
