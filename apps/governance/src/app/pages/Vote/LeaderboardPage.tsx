import React, { FC } from 'react'

import { Leaderboard } from './Leaderboard'
import { GovernancePageHeader } from '../../components/GovernancePageHeader'

export const LeaderboardPage: FC = () => (
  <div>
    <GovernancePageHeader title="Leaderboard" backTo="/vote" backTitle="Vote" />
    <Leaderboard />
  </div>
)
