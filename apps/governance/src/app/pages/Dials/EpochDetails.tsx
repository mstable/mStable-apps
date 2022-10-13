import { ThemedSkeleton, UnstyledButton } from '@apps/dumb-components'
import { ReactComponent as BackArrow } from '@apps/icons/back-arrow.svg'
import { ReactComponent as ForwardArrow } from '@apps/icons/forward-arrow.svg'
import { ViewportWidth } from '@apps/theme'
import { format } from 'date-fns'
import styled from 'styled-components'

import { useEmissionsData } from './context/EmissionsContext'
import { useEpochData, useEpochWeekNumber } from './context/EpochContext'
import { DistributionBar } from './DistributionBar'

import type { FC } from 'react'

const EPOCH_LENGTH = 604800

const ArrowButton = styled(UnstyledButton)<{ disabled?: boolean }>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  svg {
    path {
      fill: ${({ theme, disabled }) => (disabled ? theme.color.bodyTransparent : theme.color.body)};
    }
  }
`

const StyledSkeleton = styled(ThemedSkeleton)`
  width: 100%;
  border-radius: 1rem;
  > div {
    width: 100%;
    line-height: 0;
  }
`

const EpochContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  border-radius: 1rem;
  background: ${({ theme }) => theme.color.background[1]};
  padding: 0.75rem;

  > :first-child {
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    text-align: center;
    justify-content: space-between;
    margin: 0.25rem 0.875rem 0.75rem;

    > div {
      display: flex;
    }

    p {
      font-size: 0.875rem;
      padding: 0 0.5rem;
    }

    span {
      ${({ theme }) => theme.mixins.numeric};
    }

    h3 {
      color: ${({ theme }) => theme.color.body};
      font-size: 1.125rem;
      font-weight: 500;
    }
  }

  @media (min-width: ${ViewportWidth.s}) {
    > :first-child {
      flex-direction: row;
      text-align: left;
      gap: 0;
    }
  }
`

const convertEpochToTimestamp = (weekNumber: number) => weekNumber * EPOCH_LENGTH * 1000

const formatEpoch = (weekNumber: number): string => format(convertEpochToTimestamp(weekNumber), 'dd/MM')

export const EpochDetails: FC = () => {
  const [epochData] = useEpochData()
  const [emissionsData] = useEmissionsData()
  const [epochWeekNumber = emissionsData?.lastEpochWeekNumber, setEpochWeekNumber] = useEpochWeekNumber()

  const isStartEpoch = epochWeekNumber === emissionsData?.startEpochWeekNumber
  const isLastEpoch = epochWeekNumber === emissionsData?.lastEpochWeekNumber

  return (
    <EpochContainer>
      <div>
        <h3>{isLastEpoch ? 'Current Epoch' : `Epoch ${epochWeekNumber}`}</h3>
        <div>
          <ArrowButton
            disabled={isStartEpoch}
            onClick={() => {
              if (!emissionsData) return

              setEpochWeekNumber(Math.max(epochWeekNumber - 1, emissionsData.startEpochWeekNumber))
            }}
          >
            <BackArrow />
          </ArrowButton>
          {!emissionsData ? (
            <ThemedSkeleton height={20} width={100} />
          ) : (
            <p>
              Week beginning:
              <span>{` ${formatEpoch(epochWeekNumber)}`}</span>
            </p>
          )}
          <ArrowButton
            disabled={isLastEpoch}
            onClick={() => {
              if (!emissionsData) return

              setEpochWeekNumber(Math.min(epochWeekNumber + 1, emissionsData.lastEpochWeekNumber))
            }}
          >
            <ForwardArrow />
          </ArrowButton>
        </div>
      </div>
      {!!epochData?.dialVotes ? <DistributionBar /> : <StyledSkeleton height={100} />}
    </EpochContainer>
  )
}
