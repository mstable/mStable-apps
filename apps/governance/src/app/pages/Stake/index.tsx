import React, { FC } from 'react'
import styled from 'styled-components'

import { GovernancePageHeader } from '../../components/GovernancePageHeader'

import { StakeForms } from './StakeForms'
import { StakeBalances } from './StakeBalances'
import { PendingBalances } from './PendingBalances'

const Container = styled.div`
  > div:last-child {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`

export const Stake: FC = () => {
  return (
    <Container>
      <GovernancePageHeader title="Stake" stakedTokenSwitcher>
        <p>
          This dashboard allows you to stake MTA or MTA/ETH Balancer tokens in exchange for MTA rewards. As a staker, you risk getting
          diluted in the event that the mStable protocol requires recollateralisation. <a>Learn More</a>
        </p>
      </GovernancePageHeader>
      <div>
        <StakeBalances />
        <PendingBalances />
        <StakeForms />
      </div>
    </Container>
  )
}
