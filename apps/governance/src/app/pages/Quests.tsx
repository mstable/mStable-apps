import React, { FC } from 'react'

import { GovernancePageHeader } from '../components/GovernancePageHeader'

export const Quests: FC = () => {
  return (
    <div>
      <GovernancePageHeader title="Quests" />
      <div>
        <p>Completing quests boosts your voting power</p>
      </div>
    </div>
  )
}
