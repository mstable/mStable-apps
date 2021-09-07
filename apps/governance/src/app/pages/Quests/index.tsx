import React, { FC } from 'react'

import { GovernancePageHeader } from '../../components/GovernancePageHeader'
import { Meta8Console } from './Meta8Console'

export const Quests: FC = () => (
  <div>
    <GovernancePageHeader title="Quests" subtitle="Completing quests boosts your voting power" />
    <Meta8Console />
  </div>
)
