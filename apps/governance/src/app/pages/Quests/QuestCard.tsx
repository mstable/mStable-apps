import { useQuestQuery as useQuestbookQuestQuery } from '@apps/artifacts/graphql/questbook'
import { QuestType, useQuestQuery as useStakingQuestQuery } from '@apps/artifacts/graphql/staking'
import { useAccount } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { Tooltip, UnstyledButton } from '@apps/dumb-components'
import { useIdlePollInterval } from '@apps/hooks'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import styled from 'styled-components'

import { Typist } from './Typist'

import type { ComponentProps, FC } from 'react'

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

const QuestMultiplier = styled.div<{ type?: QuestType }>`
  box-shadow: 0 4px 10px ${({ type }) => (type === QuestType.Seasonal ? `#77174c` : `#271066`)};
  background: ${({ type }) =>
    type === QuestType.Seasonal
      ? `linear-gradient(180deg, #a62e6f 0%, #8b1f5a 100%)`
      : `linear-gradient(180deg, #4a27aa 0%, #32187a 100%)`};
`

const QuestSeason = styled.div`
  opacity: 0.75;
  font-size: 0.875rem;
`

const QuestFeatures = styled.div`
  position: absolute;
  bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 1rem;
  align-items: center;

  > div:first-child:not(:last-child) {
    font-size: 1.125rem;
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    margin-bottom: 0.75rem;
  }

  .qp-season {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .qp {
    padding: 0.25rem 0.5rem;
    background: ${({ theme }) => theme.color.blue};
    color: white;
    font-weight: bold;
    border-radius: 0.5rem;
    white-space: nowrap;
    &:after {
      content: ' QP';
    }
  }
`

const QuestImage = styled.div`
  display: flex;
  opacity: 0.9;
  position: absolute;
  top: 2rem;
  bottom: 0;
  width: 7rem;
  flex: 1;
  margin-bottom: 3.5rem;

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
    cursor: ${({ onClick }) => (onClick ? `pointer` : `inherit`)};
  }

  > :last-child {
    position: absolute;
    right: 0.75rem;
    bottom: 0.875rem;

    svg {
      path {
        fill: white;
      }
    }
  }
`

const CardSkeleton: FC<ComponentProps<typeof Skeleton> & { className?: string }> = props => (
  <SkeletonTheme color={'rgba(255,255,255,0.25)'} highlightColor={'rgba(255,255,255,0.15)'}>
    <Skeleton {...props} />
  </SkeletonTheme>
)

const DefaultQuestCard: FC<Props> = ({ questId, onClick }) => {
  const account = useAccount()
  const pollInterval = useIdlePollInterval(15e3)

  const clients = useApolloClients()
  const questbookQuery = useQuestbookQuestQuery({
    client: clients.questbook,
    variables: { questId, userId: account ?? '', hasUser: !!account },
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
    pollInterval,
  })
  const quest = questQuery.data?.quest
  const questType = quest?.type ?? questId === 'metanautSpaceProgram' ? QuestType.Seasonal : undefined

  return (
    <Container type={questType as never} onClick={onClick ? () => onClick?.(questId) : undefined}>
      <Title>
        {questbookQuest ? (
          <Typist>
            <h2>{questbookQuest.title}</h2>
          </Typist>
        ) : (
          <CardSkeleton height={30} />
        )}
      </Title>
      <QuestImage>
        {questbookQuest ? <img src="/assets/astroboi.gif" alt="Quest graphic" key={questId} /> : <CardSkeleton height={128} width={128} />}
      </QuestImage>
      <QuestFeatures>
        <QuestMultiplier type={questType as never}>
          1.{quest ? quest.multiplier : questId === 'metanautSpaceProgram' ? 5 : undefined}x
        </QuestMultiplier>
        <div className="qp-season">
          <QuestSeason>{questType === QuestType.Seasonal ? 'SEASON 0' : 'PERMANENT'}</QuestSeason>
          <div className="qp">100</div>
        </div>
      </QuestFeatures>
      <Tooltip tip={questbookQuest?.description} />
    </Container>
  )
}

const TimeMultiplierQuestCard: FC<Props> = ({ questId, onClick }) => (
  <Container type={QuestType.Permanent as never} onClick={onClick ? () => onClick?.(questId) : undefined}>
    <Title>
      <Typist>
        <h2>Time multiplier</h2>
      </Typist>
    </Title>
    <QuestImage>
      <img src="/assets/icons/astroboi.gif" alt="Quest graphic" key={questId} />
    </QuestImage>
    <QuestFeatures>
      <QuestMultiplier>1.2-1.6x</QuestMultiplier>
      <QuestSeason>ONGOING</QuestSeason>
    </QuestFeatures>
    <Tooltip tip={'Earn a multiplier for staking over time'} />
  </Container>
)

const DemocracyMaxiQuestCard: FC<Props> = ({ questId, onClick }) => (
  <Container type={QuestType.Seasonal as never} onClick={onClick ? () => onClick?.(questId) : undefined}>
    <Title>
      <Typist>
        <h2>Democracy Maxi</h2>
      </Typist>
    </Title>
    <QuestImage>
      <img src="/assets/icons/astroboi.gif" alt="Quest graphic" key={questId} />
    </QuestImage>
    <QuestFeatures>
      <QuestSeason>SEASON 0</QuestSeason>
    </QuestFeatures>
    <Tooltip tip="Participate in mStable Governance" />
  </Container>
)

const Cards: Record<string, FC<Props>> = {
  timeMultiplier: TimeMultiplierQuestCard,
  democracyMaxi: DemocracyMaxiQuestCard,
  default: DefaultQuestCard,
  // whale: WhaleQuestCard,
}

export const QuestCard: FC<Props> = ({ questId, onClick }) => {
  const Card = Cards[questId] ?? Cards.default
  return <Card questId={questId} onClick={onClick} />
}
