import React, { FC, useMemo } from 'react'
import styled from 'styled-components'

import { QuestObjective, useQuestQuery as useQuestbookQuestQuery, UserQuestObjective } from '@apps/artifacts/graphql/questbook'
import { QuestType, useQuestQuery as useStakingQuestQuery } from '@apps/artifacts/graphql/staking'
import { useAccount } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { ViewportWidth } from '@apps/theme'
import { Button, ThemedSkeleton, Tooltip } from '@apps/dumb-components'
import { truncateAddress } from '@apps/formatters'

import { useStakedTokenContract, useStakedTokenQuery } from '../../context/StakedToken'

import { ClaimButtons } from './ClaimButtons'
import { QuestCard } from './QuestCard'
import { QuestObjectiveProgress, QuestProgress, QuestTimeRemaining } from './QuestProgress'
import { QueueOptInOutButton } from './QueueOptInOutButtons'
import { Typist } from './Typist'
import { TransactionManifest, Interfaces } from '@apps/transaction-manifest'
import { usePropose } from '@apps/base/context/transactions'

enum ProgressType {
  Personal,
  Group,
  TimeRemaining,
  Rarity,
  Objective,
}

interface Props {
  questId: string
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
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.5) rgba(255, 255, 255, 0.5);
  padding-right: 1rem;

  ::-webkit-scrollbar {
    height: 8px;
    width: 8px;
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
    padding: 1rem 0;
    gap: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);

    > :first-child {
      width: 100%;
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    > :last-child {
      display: block;
      > * {
        color: rgba(201, 252, 213, 1);
        &:first-child {
          color: white;
        }
      }
    }

    img {
      width: 23px;
      height: 23px;
    }
  }

  > div:first-child {
    padding-top: 0;
  }

  @media (min-width: ${ViewportWidth.m}) {
    overflow-y: scroll;
    max-height: 14rem;
    height: 100%;
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

  button svg path {
    fill: white;
  }
`

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  flex: 1;
  width: 100%;
  overflow: hidden;

  h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
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
  width: 100%;

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

const DefaultQuestInfo: FC<Props> = ({ questId }) => {
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
              <Objectives>
                {questbookQuest.objectives.map(({ title, id, description, points }) => {
                  const userQuestObjective = questbookQuest.userQuest?.objectives.find(o => o.id === id)
                  return (
                    <div key={id}>
                      <div>
                        {!!points && <QP>{points.toString()}</QP>}
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

export const TimeMultiplierQuestInfo: FC<Props> = ({ questId }) => {
  const stakedTokenQuery = useStakedTokenQuery()
  const stakedTokenContract = useStakedTokenContract()
  const account = useAccount()
  const propose = usePropose()

  const quest = useMemo<{
    objectives: TimeMultiplierQuestObjective[]
    progress: number
    currentProgress: number
    currentTitle: string
    complete: boolean
  }>(() => {
    let currentProgress = 0
    let currentTitle: string
    let objectives: TimeMultiplierQuestObjective[] = [
      {
        id: '1',
        title: 'Friend of the Library',
        description: 'Staked for 3 months: 1.2x',
        seconds: 7862400,
      },
      {
        id: '2',
        title: `Congratulations ${account ? truncateAddress(account) : 'ANON METANAUT'} 😎 You are the staker of the week`,
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

    if (!balance || balance.weightedTimestamp === 0) {
      return { objectives, progress: 0, currentProgress: 0, currentTitle: objectives[0].objective.title, complete: false }
    }

    const nowUnix = Math.floor(Date.now() / 1e3)
    const hodlLength = nowUnix - balance.weightedTimestamp

    objectives = objectives.map<TimeMultiplierQuestObjective>(({ objective }, idx, arr) => {
      const previous = idx === 0 ? 0 : arr[idx - 1].objective.seconds
      const unbounded = (hodlLength - previous) / (objective.seconds - previous)
      const progress = Math.max(0, Math.min(1, unbounded))

      if (progress > 0) {
        currentTitle = objective.title
        currentProgress = progress * 100
      }

      return {
        objective,
        userObjective: {
          id: objective.id,
          progress,
          complete: progress === 1,
        },
      }
    })

    const progress = Math.max(0, Math.min(1, hodlLength / objectives[objectives.length - 1].objective.seconds)) * 100

    return { objectives, progress, currentProgress, currentTitle, complete: progress === 1 }
  }, [account, stakedTokenQuery.data?.stakedToken?.accounts])

  const handleTimeClaim = () => {
    if (!stakedTokenContract || !account) return

    propose<Interfaces.StakedToken, 'reviewTimestamp'>(
      new TransactionManifest(stakedTokenContract, 'reviewTimestamp', [account], {
        present: `Updating timestamp for ${truncateAddress(account)} `,
        past: `Updated timestamp for ${truncateAddress(account)}`,
      }),
    )
  }

  return (
    <Container>
      <QuestCard questId={questId} />
      <Inner>
        <div>
          <div>
            <Objectives>
              {quest.objectives.map(({ objective: { title, id, description }, userObjective }) => (
                <div key={id}>
                  <div>
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
            <QuestProgress
              decimals={4}
              value={quest.currentProgress}
              title={quest.currentTitle}
              progressType={ProgressType.Personal}
              questType={QuestType.Permanent}
            />
            <QuestProgress
              decimals={4}
              value={quest.progress}
              title="Overall progress"
              progressType={ProgressType.Personal}
              questType={QuestType.Permanent}
            />
          </Progress>
          <Actions>
            <Button highlighted onClick={handleTimeClaim}>
              <Tooltip tip="Claiming for Time Multiplier automatically occurs at intervals. Call claim to manually update your timestamp">
                Claim
              </Tooltip>
            </Button>
          </Actions>
        </Bottom>
      </Inner>
    </Container>
  )
}

export const DemocracyMaxiQuestInfo: FC<Props> = ({ questId }) => {
  return (
    <Container>
      <QuestCard questId={questId} />
      <Inner>
        <div>
          <div>
            <Objectives>
              <div>
                <div />
                <Typist>
                  <p>Available to complete at the end of Season 0</p>
                  <p>Participate in over 80% of mStable Governance votes over the course of Season 0 in order to qualify for this quest.</p>
                  <br />
                  <p>Rewards to be announced at a later date. Metanauts stand by for further instructions.</p>
                </Typist>
              </div>
            </Objectives>
          </div>
        </div>
        <Bottom />
      </Inner>
    </Container>
  )
}

const QuestInfoComponents: Record<string, FC<Props>> = {
  timeMultiplier: TimeMultiplierQuestInfo,
  democracyMaxi: DemocracyMaxiQuestInfo,
  // whale: WhaleQuestInfo,
  default: DefaultQuestInfo,
}

export const QuestInfo: FC<Props> = ({ questId }) => {
  const QuestInfo = QuestInfoComponents[questId] ?? QuestInfoComponents.default
  return <QuestInfo questId={questId} />
}
