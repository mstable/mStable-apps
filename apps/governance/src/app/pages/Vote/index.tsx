import React, { FC } from 'react'
import styled from 'styled-components'
import { UserLookup } from '@apps/components/core'

import { GovernancePageHeader } from '../../components/GovernancePageHeader'
import { DelegationWidget } from './DelegationWidget'
import { VoteWidget } from './VoteWidget'
import { Leaderboard } from './Leaderboard'

const Container = styled.div`
  > :last-child {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
`

export const Vote: FC = () => {
  return (
    <Container>
      <GovernancePageHeader title="Vote" subtitle="View list of voting addresses and delegate" />
      <div>
        <div>
          <DelegationWidget />
          <VoteWidget />
        </div>
        <UserLookup />
        <Leaderboard preview />
      </div>
    </Container>
  )
}
