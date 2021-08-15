import React, { FC } from 'react'

import { GovernancePageHeader } from '../components/GovernancePageHeader'

export const Stats: FC = () => {
  return (
    <div>
      <GovernancePageHeader title="Stats" />
      <div>
        <p>Overview of the mStable Governance system</p>
      </div>
    </div>
  )
}
