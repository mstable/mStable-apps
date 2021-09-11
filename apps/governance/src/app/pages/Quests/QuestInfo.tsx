import { useAccount } from '@apps/base/context/account'
import React, { FC } from 'react'
import styled from 'styled-components'

import { useQuestQuery as useQuestbookQuestQuery } from '@apps/artifacts/graphql/questbook'
import { QuestType, useQuestQuery as useStakingQuestQuery } from '@apps/artifacts/graphql/staking'
import { useApolloClients } from '@apps/base/context/apollo'
import { Button, ThemedSkeleton } from '@apps/components/core'

import { Typist } from './Typist'
import { QuestCard } from './QuestCard'
import { QuestObjectiveProgress, QuestProgress } from './QuestProgress'
import { ViewportWidth } from '@apps/base/theme'

enum ProgressType {
  Personal,
  TimeRemaining,
  Rarity,
}

const QP = styled.div`
  padding: 0.25rem 0.5rem;
  background: ${({ theme }) => theme.color.blue};
  color: white;
  font-weight: bold;
  border-radius: 0.5rem;
  white-space: nowrap;
  &:after {
    content: ' QP';
  }
`

const Objectives = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  > div {
    font-size: 0.875rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;

    > :first-child {
      width: 100%;
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    > :last-child {
      display: block;
      > :last-child {
        opacity: 0.7;
      }
    }

    img {
      width: 23px;
      height: 23px;
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

export const QuestInfo: FC<{ questId: string }> = ({ questId }) => {
  const account = useAccount()
  const clients = useApolloClients()
  const questbookQuery = useQuestbookQuestQuery({
    client: clients.questbook,
    variables: { questId, userId: account ?? '', hasUser: !!account },
    skip: !account,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
  })
  const questbookQuest = questbookQuery.data?.quest

  const questQuery = useStakingQuestQuery({
    client: clients.staking,
    variables: { id: questbookQuest?.ethereumId?.toString() },
    skip: typeof questbookQuest?.ethereumId !== 'number',
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
  })
  const quest = questQuery.data?.quest
  const questType = quest?.type

  const nowUnix = Math.floor(Date.now() / 1e3)
  const expiry = quest?.expiry
  const timeRemaining = expiry && expiry > nowUnix ? nowUnix / expiry : 0

  const questProgress = questbookQuest?.userQuest?.progress ?? 0
  console.log(questbookQuest)

  const handleClaimQuest = () => {
    // TODO;
  }

  return (
    <Container>
      <QuestCard questId={questId} />
      <Inner>
        <div>
          {questbookQuest ? (
            <Typist>
              <Objectives>
                {questbookQuest.objectives.map(({ title, id, description, points }) => {
                  const userQuestObjective = questbookQuest.userQuest?.objectives.find(o => o.id === id)
                  return (
                    <div key={id}>
                      <div>
                        <QP>{points.toString()}</QP>
                        {userQuestObjective?.complete ? (
                          <img src="/assets/tick.png" alt="Complete" />
                        ) : (
                          <img src="/assets/cross.png" alt="Incomplete" />
                        )}
                        <QuestObjectiveProgress value={(userQuestObjective?.progress ?? 0) * 100} />
                      </div>
                      <div>
                        <p>{title}</p>
                        <p>{description}</p>
                      </div>
                    </div>
                  )
                })}
              </Objectives>
            </Typist>
          ) : (
            <ThemedSkeleton height={30} />
          )}
        </div>
        <Bottom>
          <Progress>
            <QuestProgress value={questProgress * 100} progressType={ProgressType.Personal} questType={questType} />
            <QuestProgress value={timeRemaining} progressType={ProgressType.TimeRemaining} questType={questType} />
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
