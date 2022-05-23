import styled from 'styled-components'

import { GovernancePageHeader } from '../../components/GovernancePageHeader'
import { Meta8Console } from './Meta8Console'

import type { FC } from 'react'

const Formula = styled.span`
  ${({ theme }) => theme.mixins.numeric};
  background: ${({ theme }) => theme.color.background[1]};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.bodyAccent};
  margin-top: 0.5rem;
`

export const Quests: FC = () => (
  <div>
    <GovernancePageHeader title="Quests" subtitle="Increase your voting power by completing quests">
      <Formula>voting_power = balance * quest_multiplier * time_multiplier</Formula>
    </GovernancePageHeader>
    <Meta8Console />
  </div>
)
