import React, { FC } from 'react'
import styled from 'styled-components'

import { GovernancePageHeader } from '../../components/GovernancePageHeader'
import { Meta8Console } from './Meta8Console'

const Formula = styled.span`
  ${({ theme }) => theme.mixins.numeric};
  background: ${({ theme }) => theme.color.background[1]};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.bodyAccent};
`

export const Quests: FC = () => (
  <div>
    <GovernancePageHeader title="Quests" subtitle="Voting power is determined by quest completions and overall time staked.">
      <Formula>voting_power = balance * quest_multiplier * time_multiplier</Formula>
    </GovernancePageHeader>
    <Meta8Console />
  </div>
)
