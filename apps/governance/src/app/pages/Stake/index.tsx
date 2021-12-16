import React, { FC } from 'react'
import styled from 'styled-components'

import { GovernancePageHeader } from '../../components/GovernancePageHeader'

import { StakeForms } from './StakeForms'
import { StakeBalances } from './StakeBalances'
import { PendingBalances } from './PendingBalances'
import { RewardsEarnedProvider } from './context'
import { StakingStatusProvider } from '../../context/StakingStatus'

const Container = styled.div`
  > div:last-child {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`

export const Stake: FC = () => {
  return (
    <RewardsEarnedProvider>
      <Container>
        <GovernancePageHeader title="Stake" stakedTokenSwitcher subtitle="Participate in governance and earn MTA rewards" />
        <StakingStatusProvider>
          <div>
            <StakeBalances />
            <PendingBalances />
            <StakeForms />
          </div>
        </StakingStatusProvider>
      </Container>
    </RewardsEarnedProvider>
  )
}
