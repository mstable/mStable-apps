import React, { FC, useMemo } from 'react'
import styled from 'styled-components'

import { QuestObjective, useQuestQuery as useQuestbookQuestQuery, UserQuestObjective } from '@apps/artifacts/graphql/questbook'
import { QuestType, useQuestQuery as useStakingQuestQuery } from '@apps/artifacts/graphql/staking'
import { useAccount } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { ViewportWidth } from '@apps/base/theme'
import { ThemedSkeleton } from '@apps/components/core'

import { useStakedTokenQuery } from '../../context/StakedTokenProvider'

import { ClaimButtons } from './ClaimButtons'
import { QuestCard } from './QuestCard'
import { QuestObjectiveProgress, QuestProgress, QuestTimeRemaining } from './QuestProgress'
import { QueueOptInOutButton } from './QueueOptInOutButtons'
import { Typist } from './Typist'

enum ProgressType {
  Personal,
  Group,
  TimeRemaining,
  Rarity,
  Objective,
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

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.5) rgba(255, 255, 255, 0.5);
  padding-right: 1rem;

  ::-webkit-scrollbar {
    height: 4px;
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 0;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 0;
    border: 4px solid rgba(255, 255, 255, 0.5);
  }

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
        color: rgba(201, 252, 213, 1);
      }
    }

    img {
      width: 23px;
      height: 23px;
    }
  }

  @media (min-width: ${ViewportWidth.m}) {
    overflow-y: scroll;
    max-height: 7rem;
  }

  @media (min-width: ${ViewportWidth.l}) {
    max-height: 11rem;
  }
`

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1.125rem;
  justify-content: center;
  min-width: 12rem;

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
    padding: 0.5rem 1.5rem;
  }
`

const Progress = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0.75rem;
  padding: 0.75rem 1.5rem;
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

  @media (min-width: ${ViewportWidth.l}) {
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

  h3 {
    margin-bottom: 1.5rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    padding: 0.25rem 1.5rem 0;
  }

  @media (min-width: ${ViewportWidth.l}) {
    padding-right: 0;
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

const DefaultQuestInfo: FC<{ questId: string }> = ({ questId }) => {
  const account = useAccount()
  const clients = useApolloClients()

  const questbookQuery = useQuestbookQuestQuery({
    client: clients.questbook,
    variables: { questId, userId: account ?? '', hasUser: !!account },
  })

  const questbookQuest = questbookQuery.data?.quest
  const questQuery = useStakingQuestQuery({
    client: clients.staking,
    variables: { id: questbookQuest?.ethereumId?.toString() },
    skip: typeof questbookQuest?.ethereumId !== 'number',
  })
  const quest = questQuery.data?.quest
  const questType = quest?.type

  const expiry = quest?.expiry
  const questProgress = questbookQuest?.userQuest?.progress ?? 0

  return (
    <Container>
      <QuestCard questId={questId} />
      <Inner>
        <div>
          {questbookQuest ? (
            <div>
              <h3>
                <Typist>{questbookQuest.description}</Typist>
              </h3>
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
                      <Typist>
                        <p>{title}</p>
                        <p>{description}</p>
                      </Typist>
                    </div>
                  )
                })}
              </Objectives>
            </div>
          ) : (
            <ThemedSkeleton height={30} />
          )}
        </div>
        <Bottom>
          <Progress>
            <QuestProgress value={questProgress * 100} progressType={ProgressType.Personal} questType={questType} />
            <QuestTimeRemaining expiry={expiry} />
          </Progress>
          <Actions>
            <QueueOptInOutButton />
            <ClaimButtons questId={questId} />
          </Actions>
        </Bottom>
      </Inner>
    </Container>
  )
}

interface TimeMultiplierQuestObjective {
  objective: Omit<QuestObjective, 'points'> & { seconds: number }
  userObjective?: UserQuestObjective
}

export const TimeMultiplierQuestInfo: FC<{ questId: string }> = ({ questId }) => {
  const stakedTokenQuery = useStakedTokenQuery()
  const account = useAccount()

  const quest = useMemo<{ objectives: TimeMultiplierQuestObjective[]; progress: number; complete: boolean }>(() => {
    let objectives: TimeMultiplierQuestObjective[] = [
      {
        id: '1',
        title: 'Friend of the Library',
        description: 'Staked for 3 months: 1.2x',
        seconds: 7862400,
      },
      {
        id: '2',
        title: `Congratulations ${account ?? 'Metanaut'} 😎 You are the staker of the week`,
        description: 'Staked for 6 months: 1.3x',
        seconds: 15724800,
      },
      {
        id: '3',
        title: 'Happy birthday 🎂 and many happy financial returns',
        description: 'Staked for 12 months: 1.4x',
        seconds: 31449600,
      },
      {
        id: '4',
        title: '‘naut since small times',
        description: 'Staked for 18 months: 1.5x',
        seconds: 47174400,
      },
      {
        id: '5',
        title: 'mStable Platinum Select',
        description: 'Staked for 24 months: 1.6x',
        seconds: 62899200,
      },
    ].map(objective => ({ objective }))

    const balance = stakedTokenQuery.data?.stakedToken?.accounts?.[0]?.balance

    if (!balance) return { objectives, progress: 0, complete: false }

    const nowUnix = Math.floor(Date.now() / 1e3)
    const hodlLength = nowUnix - balance.weightedTimestamp

    objectives = objectives.map<TimeMultiplierQuestObjective>(({ objective }, idx, arr) => {
      const previous = idx === 0 ? 0 : arr[idx - 1].objective.seconds
      const unbounded = (hodlLength - previous) / (objective.seconds - previous)
      const progress = Math.max(0, Math.min(1, unbounded))
      return {
        objective,
        userObjective: {
          id: objective.id,
          progress,
          complete: progress === 1,
        },
      }
    })

    const progress = Math.max(0, Math.min(1, hodlLength / objectives[objectives.length - 1].objective.seconds))

    return { objectives, progress, complete: progress === 1 }
  }, [account, stakedTokenQuery.data?.stakedToken?.accounts])

  return (
    <Container>
      <QuestCard questId={questId} />
      <Inner>
        <div>
          <div>
            <h3>
              <Typist>Good things come to those who wait – earn a multiplier for staking over time</Typist>
            </h3>
            <Objectives>
              {quest.objectives.map(({ objective: { title, id, description }, userObjective }) => (
                <div key={id}>
                  <div>
                    <div />
                    {userObjective?.complete ? (
                      <img src="/assets/tick.png" alt="Complete" />
                    ) : (
                      <img src="/assets/cross.png" alt="Incomplete" />
                    )}
                    <QuestObjectiveProgress value={(userObjective?.progress ?? 0) * 100} />
                  </div>
                  <Typist>
                    <p>{title}</p>
                    <p>{description}</p>
                  </Typist>
                </div>
              ))}
            </Objectives>
          </div>
        </div>
        <Bottom>
          <Progress>
            <QuestProgress decimals={4} value={quest.progress} progressType={ProgressType.Personal} questType={QuestType.Permanent} />
          </Progress>
          <div />
        </Bottom>
      </Inner>
    </Container>
  )
}

export const QuestInfo: FC<{ questId: string }> = ({ questId }) =>
  questId === 'timeMultiplier' ? <TimeMultiplierQuestInfo questId={questId} /> : <DefaultQuestInfo questId={questId} />
