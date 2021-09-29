import React, { FC } from 'react'
import styled from 'styled-components'

import { GovernancePageHeader } from '../../components/GovernancePageHeader'

import { StakeForms } from './StakeForms'
import { StakeBalances } from './StakeBalances'
import { PendingBalances } from './PendingBalances'
import { RewardsEarnedProvider } from './context'
import { StakingStatusProvider } from '../../context/StakingStatusProvider'

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
        <GovernancePageHeader title="Stake" stakedTokenSwitcher>
          <p>
            This dashboard allows you to stake MTA or MTA/ETH Balancer tokens in exchange for MTA rewards. As a staker, you risk getting
            diluted in the event that the mStable protocol requires recollateralisation.{' '}
            <a href="https://app.gitbook.com/@mstable/s/mstable-docs/" target="_blank" rel="noopener noreferrer">
              Learn More
            </a>
          </p>
        </GovernancePageHeader>
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
