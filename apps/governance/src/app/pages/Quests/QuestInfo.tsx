import React, { FC } from 'react'
import { useToggle } from 'react-use'
import styled from 'styled-components'
import useSound from 'use-sound'

// @ts-ignore
import bleep28 from '../../../assets/bleeps_28.mp3'
// @ts-ignore
import bleep29 from '../../../assets/bleeps_29.mp3'

import { useQuestQuery as useQuestbookQuestQuery, useUpdateQuestMutation } from '@apps/artifacts/graphql/questbook'
import { QuestType, useQuestQuery as useStakingQuestQuery } from '@apps/artifacts/graphql/staking'
import { useApolloClients } from '@apps/base/context/apollo'
import { Button, ThemedSkeleton } from '@apps/components/core'
import { ViewportWidth } from '@apps/base/theme'
import { TransactionManifest, Interfaces } from '@apps/transaction-manifest'
import { useAccount } from '@apps/base/context/account'
import { usePropose } from '@apps/base/context/transactions'

import { useQuestManagerContract } from '../../context/QuestManagerProvider'
import { QueueOptInOutButton } from './QueueOptInOutButtons'

import { Typist } from './Typist'
import { QuestCard } from './QuestCard'
import { QuestObjectiveProgress, QuestProgress, QuestTimeRemaining } from './QuestProgress'

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

export const QuestInfo: FC<{ questId: string }> = ({ questId }) => {
  const [isPending, toggleIsPending] = useToggle(false)
  const account = useAccount()
  const clients = useApolloClients()
  const questManagerContract = useQuestManagerContract()
  const propose = usePropose()

  const [playBleep28] = useSound(bleep28, { volume: 0.2 })
  const [playBleep29] = useSound(bleep29, { volume: 0.2 })

  const questbookQuery = useQuestbookQuestQuery({
    client: clients.questbook,
    variables: { questId, userId: account ?? '', hasUser: !!account },
  })

  const [updateQuest] = useUpdateQuestMutation({
    client: clients.questbook,
    variables: { questId, userId: account, hasUser: !!account },
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

  const handleClaimQuest = () => {
    if (
      isPending ||
      !questManagerContract ||
      !questbookQuest ||
      typeof questbookQuest.ethereumId !== 'number' ||
      !questbookQuest.userQuest?.signature
    )
      return

    propose(
      new TransactionManifest<Interfaces.QuestManager, 'completeUserQuests'>(
        questManagerContract,
        'completeUserQuests',
        [account, [questbookQuest.ethereumId], questbookQuest.userQuest.signature],
        {
          present: 'Complete quest',
          past: 'Completed quest',
        },
      ),
    )
  }

  const handleRefresh = () => {
    if (isPending) return

    playBleep28()
    toggleIsPending(true)
    updateQuest()
      .catch(error => {
        console.error(error)
      })
      .finally(() => {
        toggleIsPending(false)
        playBleep29()
      })
  }

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
            {questbookQuest?.userQuest?.complete ? (
              <Button highlighted onClick={handleClaimQuest}>
                Claim
              </Button>
            ) : (
              <Button highlighted onClick={handleRefresh}>
                {isPending ? 'Checking...' : 'Check status'}
              </Button>
            )}
          </Actions>
        </Bottom>
      </Inner>
    </Container>
  )
}
