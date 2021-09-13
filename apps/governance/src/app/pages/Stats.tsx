import { Tooltip } from '@apps/components/core'
import React, { FC } from 'react'
import styled from 'styled-components'

import { GovernancePageHeader } from '../components/GovernancePageHeader'

const StyledTooltip = styled(Tooltip)`
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  padding: 1.25rem 3rem;
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  gap: 0.5rem;

  h3 {
    color: ${({ theme }) => theme.color.bodyAccent};
    font-size: 0.875rem;
  }

  span {
    ${({ theme }) => theme.mixins.numeric};
    color: ${({ theme }) => theme.color.body};
    font-size: 1.25rem;
  }
`

const StatsBox: FC<{ tip?: string; title: string; subtitle: string }> = ({ title, subtitle, tip }) => (
  <Box>
    {tip && <StyledTooltip tip={tip} />}
    <h3>{title}</h3>
    <span>{subtitle}</span>
  </Box>
)

const Container = styled.div`
  > div:last-child {
    display: flex;
    gap: 0.5rem;
  }
`

export const Stats: FC = () => {
  return (
    <Container>
      <GovernancePageHeader title="Stats" subtitle="Overview of the mStable Governance system" />
      <div>
        <StatsBox tip="Hello, world!" title="Recollateralisation Percentage" subtitle={'25.00%'} />
        <StatsBox tip="Hello, world!" title="Withdrawal Cooldown" subtitle={'10d'} />
        <StatsBox tip="Hello, world!" title="Withdrawal Period" subtitle={'3d'} />
      </div>
    </Container>
  )
}
