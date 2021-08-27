import React, { FC } from 'react'
import styled from 'styled-components'

// TODO use Snapshot gql data
const items = [
  {
    id: 1,
    title: 'Creation & Funding of the mStableDAO Asset Management subDAO',
    status: 'Closed',
    date: 'March 14th, 2021',
    choice: '207,692 MTA weekly',
  },
]

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
      font-size: 1.1rem;
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

const VotingHistoryItem: FC<{ id: string | number; status: string; title: string; date: string; choice?: string }> = ({
  status,
  title,
  date,
  choice,
}) => (
  <VotingHistoryItemContainer>
    <div>
      <div>{title}</div>
      <div>{status}</div>
    </div>
    <div>
      <div>{date}</div>
      <div>{choice}</div>
    </div>
  </VotingHistoryItemContainer>
)

const Container = styled.div`
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

export const VotingHistory: FC<{ addressOrENSName: string; address?: string }> = ({ address, addressOrENSName }) => {
  return (
    <Container>
      <h3>Voting History</h3>
      <div>
        {items.map(({ title, id, status, date, choice }) => (
          <VotingHistoryItem key={id} id={id} title={title} status={status} date={date} choice={choice} />
        ))}
      </div>
    </Container>
  )
}
