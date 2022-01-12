import React, { FC } from 'react'
import { formatDistanceToNow, getUnixTime } from 'date-fns'
import styled from 'styled-components'

import { QuestType } from '@apps/artifacts/graphql/staking'
import { ThemedSkeleton } from '@apps/dumb-components'

import { Typist } from './Typist'

enum ProgressType {
  Personal,
  Group,
  TimeRemaining,
  Rarity,
  Objective,
}

const ProgressBar = styled.div.attrs((props: { value?: number }) => ({ width: `${props.value.toFixed(0)}%` }))`
  width: 100%;
  height: 0.5rem;
  position: relative;

  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 1rem;
    width: ${props => props.width};
  }
`

const Container = styled.div<{ progressType: ProgressType; questType?: QuestType }>`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.75);
  width: 100%;

  span {
    color: white;
  }

  > :first-child {
    > div {
      display: flex;
      justify-content: space-between;
    }
  }

  > :first-child + div {
    margin-top: 0.25rem;
    overflow: hidden;
    background: ${({ theme }) => (theme.isLight ? '#584b48' : '#464050')};
    &:after {
      background: ${({ progressType }) =>
        progressType === ProgressType.Rarity ? '#42C1E9' : progressType === ProgressType.TimeRemaining ? '#E94C42' : '#6CC000'};
    }
  }
`

const QuestObjectiveProgressContainer = styled(Container)`
  > :last-child {
    background: ${({ theme }) => (theme.isLight ? '#735f5c' : '#473f50')};
  }
`

export const QuestProgress: FC<{ value?: number; title?: string; progressType: ProgressType; questType?: QuestType; decimals?: number }> =
  ({ value, progressType, questType, title, decimals = 2 }) => (
    <Container progressType={progressType} questType={questType}>
      <div>
        {typeof value === 'number' ? (
          <Typist>
            {title ??
              (progressType === ProgressType.Personal
                ? 'My completion'
                : progressType === ProgressType.Group
                ? 'Group completion'
                : 'Rarity')}
            <span>{value.toFixed(decimals)}%</span>
          </Typist>
        ) : (
          <ThemedSkeleton height={20} />
        )}
      </div>
      {/* @ts-ignore */}
      <ProgressBar value={value} />
    </Container>
  )

export const QuestTimeRemaining: FC<{ expiry?: number }> = ({ expiry }) => {
  const expired = expiry && expiry > 0 && getUnixTime(Date.now()) > expiry
  return (
    <Container progressType={ProgressType.TimeRemaining} questType={QuestType.Seasonal}>
      <div>
        {typeof expiry !== 'number' ? (
          <ThemedSkeleton height={20} />
        ) : expired ? (
          <span>Expired</span>
        ) : (
          <Typist>
            Time remaining
            <span>{formatDistanceToNow(expiry * 1000)}</span>
          </Typist>
        )}
      </div>
    </Container>
  )
}

export const QuestObjectiveProgress: FC<{ value?: number }> = ({ value }) => (
  <QuestObjectiveProgressContainer progressType={ProgressType.Objective}>
    <div>
      {typeof value === 'number' ? (
        <Typist>
          <span>{value.toFixed(2)}%</span>{' '}
        </Typist>
      ) : (
        <ThemedSkeleton height={20} />
      )}
    </div>
    {/* @ts-ignore */}
    <ProgressBar value={value} />
  </QuestObjectiveProgressContainer>
)
