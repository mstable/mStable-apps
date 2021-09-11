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
    font-size: 1.4rem;
    line-height: 1.8rem;
    text-align: center;
  }
`

const QuestMultiplier = styled.div`
  position: absolute;
  bottom: 1rem;
  display: flex;
  justify-content: center;
  width: 100%;

  > div {
    background: linear-gradient(180deg, #a62e6f 0%, #8b1f5a 100%);
    box-shadow: 0px 4px 10px #78144a;
    font-size: 1.125rem;
    padding: 0.75rem 1rem;
    border-radius: 1rem;
  }
`

const QuestImage = styled.div`
  display: flex;
  mix-blend-mode: lighten;
  width: 7rem;

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
  gap: 1.5rem;
  padding: 1rem;
  border-radius: 1rem;
  min-height: 20rem;
  transition: 0.25s linear transform;
  box-shadow: inset 0 0 0 2px rgba(252, 174, 220, 0.5);
  background: ${({ type }) =>
    type === QuestType.Seasonal
      ? `linear-gradient(333.23deg, #8b1e59 30.23%, #ff3abd 135.17%)`
      : `linear-gradient(333.23deg, #3B1E8B 30.23%, #E364B8 135.17%)`};

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
    variables: { id: questbookQuest?.ethereumId?.toString() as string },
    skip: typeof questbookQuest?.ethereumId !== 'number',
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-and-network',
  })
  const quest = questQuery.data?.quest
  const questType = quest?.type

  return (
    <Container type={questType as never} onClick={onClick ? () => onClick?.(questId) : undefined}>
      <Title>
        {questbookQuest ? (
          <Typist>
            <h2>{questbookQuest.title}</h2>
            <h3>{questbookQuest.description}</h3>
          </Typist>
        ) : (
          <CardSkeleton height={30} />
        )}
      </Title>
      <QuestImage>
        {questbookQuest ? (
          <IPFSImg uri={questbookQuest.imageURI ?? 'ipfs://QmZJWYtqb9xRYVLcPocEJmzbwe4BBJuPNcfb9ApAQ8hava'} alt="Quest graphic" />
        ) : (
          <CardSkeleton height={128} width={128} />
        )}
      </QuestImage>
      <QuestMultiplier>
        <div>1.{quest?.multiplier.toString().slice(1)}x</div>
      </QuestMultiplier>
    </Container>
  )
}
