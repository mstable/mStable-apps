import React, { FC, ComponentProps } from 'react'
import styled from 'styled-components'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import { useAccount } from '@apps/base/context/account'
import { useQuestQuery as useQuestbookQuestQuery } from '@apps/artifacts/graphql/questbook'
import { QuestType, useQuestQuery as useStakingQuestQuery } from '@apps/artifacts/graphql/staking'
import { useApolloClients } from '@apps/base/context/apollo'
import { IPFSImg, UnstyledButton } from '@apps/components/core'
import { Typist } from './Typist'

interface Props {
  onClick?: (questId: string) => void
  questId: string
}

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  h2 {
    font-size: 1.5rem;
    line-height: 2rem;
    text-align: center;
  }
`

const QuestMultiplier = styled.div<{ type?: QuestType }>`
  display: flex;
  height: 100%;
  align-items: flex-end;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  padding: 1rem 0 0.5rem;

  > div {
    background: ${({ type }) =>
      type === QuestType.Seasonal
        ? `linear-gradient(180deg, #4c24bb 0%, #2c1470 100%)`
        : `linear-gradient(180deg, #a31e65 0%, #751749 100%)`};
    box-shadow: 0px 4px 10px ${({ type }) => (type === QuestType.Seasonal ? '#220f58' : '#520f32')};
    font-size: 1.125rem;
    padding: 0.75rem 1rem;
    border-radius: 1rem;
  }
`

const QuestImage = styled.div`
  display: flex;
  mix-blend-mode: lighten;
  width: 7.5rem;

  img {
    width: 100%;
    height: auto;
    animation: rotating 32s linear infinite;
    align-self: center;
    justify-self: center;
  }
`

const Container = styled(UnstyledButton)<{ type?: QuestType }>`
  @keyframes rotating {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  display: flex;
  position: relative;
  flex-direction: column;
  width: 16rem;
  min-width: 16rem;
  align-items: center;
  color: white;
  padding: 1rem 0;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 1rem;
  min-height: 20rem;
  transition: 0.25s linear transform;
  box-shadow: inset 0 0 0 2px rgba(252, 174, 220, 0.5);
  background: ${({ type }) =>
    type === QuestType.Seasonal
      ? `linear-gradient(333.23deg, #3B1E8B 30.23%, #E364B8 135.17%)`
      : `linear-gradient(333.23deg, #8b1e59 30.23%, #ff3abd 135.17%)`};

  &:hover {
    transform: ${({ onClick }) => !!onClick && `scale(1.01)`};
    cursor: ${({ onClick }) => (!!onClick ? `pointer` : `inherit`)};
  }
`

const CardSkeleton: FC<ComponentProps<typeof Skeleton> & { className?: string }> = props => (
  <SkeletonTheme color={'rgba(255,255,255,0.25)'} highlightColor={'rgba(255,255,255,0.15)'}>
    <Skeleton {...props} />
  </SkeletonTheme>
)

export const QuestCard: FC<Props> = ({ questId, onClick }) => {
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

  return (
    <>
      {/* @ts-ignore */}
      <Container type={questType} onClick={onClick ? () => onClick?.(questId) : undefined}>
        <Title>
          {questbookQuery.data?.quest ? (
            <Typist>
              <h2>{questbookQuery.data.quest.metadata?.title}</h2>
            </Typist>
          ) : (
            <CardSkeleton height={30} />
          )}
        </Title>
        <QuestImage>
          {questbookQuery.data?.quest ? (
            <IPFSImg uri={questbookQuery.data.quest.metadata?.imageUrl} alt="Quest graphic" />
          ) : (
            <CardSkeleton height={128} width={128} />
          )}
        </QuestImage>
        <QuestMultiplier type={questType}>
          <div>1.{questQuery.data?.quest.multiplier.toString().slice(1)}x</div>
        </QuestMultiplier>
      </Container>
    </>
  )
}
