import React, { FC } from 'react'
import { ExternalLink } from '@apps/components/core'

import { GovernancePageHeader } from '../components/GovernancePageHeader'

export const Stake: FC = () => {
  return (
    <div>
      <GovernancePageHeader title="Stake" />
      <div>
        <p>
          This dashboard allows you to stake MTA or MTA/ETH Balancer tokens in exchange for MTA rewards. As a staker, you risk getting
          diluted in the event that the mStable protocol requires recollateralisation. <ExternalLink>Read More</ExternalLink>
        </p>
      </div>
    </div>
  )
}
