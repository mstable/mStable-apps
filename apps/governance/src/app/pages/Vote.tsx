import React, { FC } from 'react'

import { GovernancePageHeader } from '../components/GovernancePageHeader'

export const Vote: FC = () => {
  return (
    <div>
      <GovernancePageHeader title="Vote" />
      <div>
        <p>View list of voting addresses and delegate</p>
      </div>
    </div>
  )
}
