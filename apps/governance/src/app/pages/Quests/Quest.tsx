import { useAccount } from '@apps/base/context/account'
import React, { FC } from 'react'
import styled from 'styled-components'

import { useQuestQuery as useQuestbookQuestQuery } from '@apps/artifacts/graphql/questbook'
import { QuestType, useQuestQuery as useStakingQuestQuery } from '@apps/artifacts/graphql/staking'
import { useApolloClients } from '@apps/base/context/apollo'
import { IPFSImg, ThemedSkeleton } from '@apps/components/core'

import { Typist } from './Typist'

enum ProgressType {
  Personal,
  Group,
  TimeRemaining,
  Rarity,
}

const ProgressBar = styled.div.attrs((props: { value?: number }) => ({ width: `${(props.value * 100).toFixed(0)}%` }))`
  width: 100%;
  height: 1rem;
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

const ProgressContainer = styled.div<{ progressType: ProgressType; questType?: QuestType }>`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  span {
    color: white
  }

  > :last-child {
    border-radius: 0.25rem;
    overflow: hidden;
    background: ${({ questType }) => (questType === QuestType.Seasonal ? '#77164b' : '#77164b')};
    &:after {
      background: ${({ progressType }) =>
        progressType === ProgressType.Rarity ? '#42C1E9' : progressType === ProgressType.TimeRemaining ? '#E94C42' : '#6CC000'};
  }
`

const Progress: FC<{ value?: number; progressType: ProgressType; questType?: QuestType }> = ({ value, progressType, questType }) => (
  <ProgressContainer progressType={progressType} questType={questType}>
    <div>
      {typeof value === 'number' ? (
        <Typist>
          <span>{(value * 100).toFixed(2)}%</span>{' '}
          {progressType === ProgressType.Personal
            ? 'My completion'
            : progressType === ProgressType.Group
            ? 'Group completion'
            : progressType === ProgressType.TimeRemaining
            ? 'TODO time remaining'
            : 'Rarity'}
        </Typist>
      ) : (
        <ThemedSkeleton height={20} />
      )}
    </div>
    {/* @ts-ignore */}
    <ProgressBar value={value} />
  </ProgressContainer>
)

const Container = styled.div<{ type?: QuestType }>`
  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding: 1rem;
  border-radius: 1rem;
  min-height: 20rem;
  text-shadow: -1px 1px 0 #fe33ad;

  background: ${({ type }) =>
    type === QuestType.Seasonal
      ? `linear-gradient(333.23deg, #8b1e59 30.23%, #e364b8 135.17%);`
      : `linear-gradient(333.23deg, #8b1e59 30.23%, #e364b8 135.17%);`};

  .metadata {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex-basis: 40%;
    > :first-child {
      display: flex;
      gap: 0.5rem;
      justify-content: space-between;
    }
    > :last-child {
      > * {
        background: rgba(222, 64, 149, 1);
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        flex: 1;
        font-size: 1.5rem;
      }
    }

    > :first-child {
      mix-blend-mode: lighten;
      border-radius: 1rem;
      background: rgba(254, 203, 234, 0.1);
      overflow: hidden;
      img {
        width: 100%;
        height: auto;
        animation: rotating 32s linear infinite;
        align-self: center;
        justify-self: center;
      }
    }
  }

  > :first-child {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    flex-basis: 50%;

    > :first-child {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      justify-content: space-between;

      > :last-child {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  }

  > :last-child {
    flex: 1;
  }

  h3 {
    font-size: 1.8rem;
    line-height: 1.9rem;
  }

  h2 {
    font-size: 2.2rem;
    line-height: 2.8rem;
  }

  h2,
  button {
    font-family: 'VT323', monospace;
  }
`

export const Quest: FC<{ questId: string }> = ({ questId }) => {
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
    variables: { questId, userId: account ?? '', hasUser: !!account },
    skip: !account,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
  })

  const questType = questQuery.data?.quest.type

  return (
    <Container type={questType}>
      <div>
        <div>
          <div className="title">
            {questbookQuery.data?.quest ? (
              <Typist>
                <h2>{questbookQuery.data.quest.title}</h2>
                <p>{questbookQuery.data.quest.description}</p>
              </Typist>
            ) : (
              <ThemedSkeleton height={30} />
            )}
          </div>
          <div className="progress">
            <Progress
              value={questbookQuery.data?.quest?.userQuest?.progress ?? 0}
              progressType={ProgressType.Personal}
              questType={questType}
            />
            <Progress value={13} progressType={ProgressType.TimeRemaining} questType={questType} />
            <Progress value={0} progressType={ProgressType.Rarity} questType={questType} />
          </div>
        </div>
        <div className="metadata">
          <div>
            {questbookQuery.data?.quest ? (
              <IPFSImg
                uri={questbookQuery.data.quest.imageURI ?? 'ipfs://QmZJWYtqb9xRYVLcPocEJmzbwe4BBJuPNcfb9ApAQ8hava'}
                alt="Quest graphic"
              />
            ) : (
              <ThemedSkeleton height={128} width={128} />
            )}
          </div>
          <div>
            <div>{questType === QuestType.Seasonal ? 'S-0' : 'P'}</div>
            <div>1.{questQuery.data?.quest.multiplier.toString().slice(1)}x</div>
          </div>
          <div>
            <div>Claim</div>
          </div>
        </div>
      </div>
      <div className="eligibility">
        <h3>Eligibility</h3>
        <p>TODO load from questbook metadata</p>
      </div>
    </Container>
  )
}
