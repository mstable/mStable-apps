import React, { FC } from 'react'
import { format } from 'date-fns'
import styled from 'styled-components'

import { ThemedSkeleton, UnstyledButton } from '@apps/dumb-components'
import { ReactComponent as BackArrow } from '@apps/icons/back-arrow.svg'
import { ReactComponent as ForwardArrow } from '@apps/icons/forward-arrow.svg'
import { ViewportWidth } from '@apps/theme'

import { useEpochData, useEpochWeekNumber } from './context/EpochContext'
import { useEmissionsData } from './context/EmissionsContext'
import { DistributionBar } from './DistributionBar'

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

const DistributionContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  background: ${({ theme }) => theme.color.background[0]};
  padding: 1rem;
  border-radius: 0.75rem;
  gap: 1rem;
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

const convertEpochToTimestamp = (weekNumber: number) => {
  // TODO revert
  // const distributionPeriod = 604800
  const distributionPeriod = 3600

  return weekNumber * distributionPeriod * 1000
}

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
            <span>{`(${formatEpoch(emissionsData.startEpochWeekNumber)} - ${formatEpoch(emissionsData.lastEpochWeekNumber)})`}</span>
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
      {!(epochData && epochData.dialVotes) ? (
        <StyledSkeleton height={100} />
      ) : (
        <DistributionContainer>
          <DistributionBar />
        </DistributionContainer>
      )}
    </EpochContainer>
  )
}
