import { useVotesQuery } from '@apps/artifacts/graphql/snapshot'
import { useApolloClients } from '@apps/base/context/apollo'
import { ExternalLink } from '@apps/dumb-components'
import { formatUnix } from '@apps/formatters'
import styled from 'styled-components'

import type { VotesQueryResult } from '@apps/artifacts/graphql/snapshot'
import type { FC } from 'react'

type VoteData = NonNullable<VotesQueryResult['data']>['votes'][number]

const VotingHistoryItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  padding: 1rem;
  border: 1px ${({ theme }) => theme.color.background[2]} solid;
  border-radius: 1rem;

  > * {
    display: flex;
    justify-content: space-between;
    gap: 1rem;

    > :last-child {
      border-radius: 0.5rem;
      padding: 0.25rem 0.5rem;
      font-size: 0.9rem;
    }
  }

  > :first-child {
    align-items: flex-start;

    > :first-child {
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.5rem;
    }

    > :last-child {
      border: 1px ${({ theme }) => theme.color.background[2]} solid;
    }
  }

  > :last-child {
    align-items: flex-end;

    > :first-child {
      color: ${({ theme }) => theme.color.bodyAccent};
      font-size: 0.9rem;
    }

    > :last-child {
      background: ${({ theme }) => theme.color.background[2]};
    }
  }
`

const VotingHistoryItem: FC<VoteData['proposal'] & Omit<VoteData, 'proposal'>> = ({ state, title, created, choice, choices, link }) => (
  <VotingHistoryItemContainer>
    <div>
      <ExternalLink href={link}>{title}</ExternalLink>
      <div>{state.slice(0, 1).toUpperCase() + state.slice(1)}</div>
    </div>
    <div>
      <div>{formatUnix(created)}</div>
      <div>{choices[choice - 1]}</div>
    </div>
  </VotingHistoryItemContainer>
)

const Empty = styled.div`
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  padding: 1rem;
  border-radius: 1rem;
`

const Container = styled.div`
  flex: 1;

  h3 {
    font-weight: 600;
    padding: 0 1rem 1rem;
  }
  > :last-child {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`

export const VotingHistory: FC<{ addressOrENSName: string; address?: string }> = ({ address }) => {
  const { snapshot: client } = useApolloClients()
  const votesQuery = useVotesQuery({ client, variables: { account: address }, skip: !address })

  return (
    <Container>
      <h3>Voting History</h3>
      <div>
        {votesQuery.data?.votes?.length ? (
          votesQuery.data?.votes.map(({ proposal: { title, state, link, choices }, id, created, choice }) => (
            <VotingHistoryItem
              key={id}
              id={id}
              title={title}
              state={state}
              link={link}
              created={created}
              choice={choice}
              choices={choices}
            />
          ))
        ) : (
          <Empty>
            <p>No voter history</p>
          </Empty>
        )}
      </div>
    </Container>
  )
}
