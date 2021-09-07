import { useAccount } from '@apps/base/context/account'
import React, { FC } from 'react'
import styled from 'styled-components'

import { useQuestQuery as useQuestbookQuestQuery } from '@apps/artifacts/graphql/questbook'
import { QuestType, useQuestQuery as useStakingQuestQuery } from '@apps/artifacts/graphql/staking'
import { useApolloClients } from '@apps/base/context/apollo'
import { Button, ThemedSkeleton } from '@apps/components/core'

import { Typist } from './Typist'
import { QuestCard } from './QuestCard'
import { QuestProgress } from './QuestProgress'
import { ViewportWidth } from '@apps/base/theme'

enum ProgressType {
  Personal,
  Group,
  TimeRemaining,
  Rarity,
}

const Objectives = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > div {
    font-size: 0.875rem;
    display: flex;
    align-items: center;

    img {
      margin-right: 0.75rem;
    }
  }
`

const Season = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1.125rem;
  justify-content: center;

  > div:first-child {
    display: flex;
    align-items: center;
    border-radius: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 0.75rem 0.5rem;

    span {
      margin-left: 0.5rem;
      font-size: 0.75rem;
    }
  }

  button {
    padding: 0.75rem 1.5rem;
  }
`

const Progress = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`

const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 1rem;

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    gap: 0;
    padding-bottom: 0;

    > div:first-child {
      margin-right: 1.5rem;
    }
  }
`

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  flex: 1;

  @media (min-width: ${ViewportWidth.m}) {
    padding: 0.25rem 1.5rem 0;
  }
`

const Container = styled.div<{ type?: QuestType }>`
  display: flex;
  justify-content: space-between;
  border-radius: 1rem;
  min-height: 20rem;
  flex: 1;

  > *:first-child {
    display: none;
  }

  @media (min-width: ${ViewportWidth.m}) {
    > *:first-child {
      display: inherit;
      max-width: 16rem;
      width: 100%;
    }
  }
`

const mockObjectives: {
  title: string
  description: string
  points: number
  complete: boolean
  progress: number
}[] = [
  {
    title: 'STAKED IN MSTABLE BEFORE 16.01.19',
    description: 'Tooltip',
    points: 120,
    complete: true,
    progress: 12,
  },
  {
    title: 'STAKED in mStable v2 staking',
    description: 'Tooltip',
    points: 120,
    complete: false,
    progress: 12,
  },
  {
    title: 'new deposit is at least 80% of your staking v1 balance at its highest point',
    description: 'Tooltip',
    points: 120,
    complete: false,
    progress: 12,
  },
]

export const QuestInfo: FC<{ questId: string }> = ({ questId }) => {
  const account = useAccount()
  const clients = useApolloClients()
  const questQuery = useStakingQuestQuery({
    client: clients.staking,
    variables: { id: questId },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
  })
  const questbookQuery = useQuestbookQuestQuery({
    client: clients.questbook,
    variables: { id: questId, account: account ?? '', hasAccount: !account },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
  })

  const questType = questQuery.data?.quest.type

  const handleClaimQuest = () => {
    // TODO;
  }

  return (
    <Container>
      <QuestCard questId={questId} />
      <Inner>
        <div>
          {questbookQuery.data?.quest ? (
            <Typist>
              <Objectives>
                {mockObjectives.map(({ title, complete }) => (
                  <div>
                    {complete ? <img src="/assets/tick.png" alt="Complete" /> : <img src="/assets/cross.png" alt="Incomplete" />}
                    <p>{title}</p>
                  </div>
                ))}
              </Objectives>
            </Typist>
          ) : (
            <ThemedSkeleton height={30} />
          )}
        </div>
        <Bottom>
          <Progress>
            <QuestProgress
              value={questbookQuery.data?.quest.submission?.progress ?? 0}
              progressType={ProgressType.Personal}
              questType={questType}
            />
            <QuestProgress value={42} progressType={ProgressType.Group} questType={questType} />
            <QuestProgress value={13} progressType={ProgressType.TimeRemaining} questType={questType} />
          </Progress>
          <Season>
            <div>
              {questType === QuestType.Seasonal ? 'S-0' : 'P'}
              <span>solo QUEST</span>
            </div>
            <Button highlighted onClick={handleClaimQuest}>
              Claim
            </Button>
          </Season>
        </Bottom>
      </Inner>
    </Container>
  )
}
