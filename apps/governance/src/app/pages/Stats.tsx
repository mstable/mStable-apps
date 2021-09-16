import { Tooltip } from '@apps/components/core'
import React, { FC } from 'react'
import styled from 'styled-components'

import { GovernancePageHeader } from '../components/GovernancePageHeader'
import { useStakedTokenQuery } from '../context/StakedTokenProvider'

const DAY = 86400

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
  text-align: center;

  h3 {
    color: ${({ theme }) => theme.color.bodyAccent};
    font-size: 0.875rem;
  }

  span {
    ${({ theme }) => theme.mixins.numeric};
    color: ${({ theme }) => theme.color.body};
    font-size: 1.25rem;
    font-weight: 300;
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
  const { data } = useStakedTokenQuery()
  const collateralisationRatio = parseFloat(data?.stakedToken?.collateralisationRatio ?? '0') / 1e16
  const slashingPercentage = parseFloat(data?.stakedToken?.slashingPercentage ?? '0') / 1e16
  const cooldown = parseInt(data?.stakedToken?.COOLDOWN_SECONDS ?? '0') / DAY
  const unstakeWindow = parseInt(data?.stakedToken?.UNSTAKE_WINDOW ?? '0') / DAY

  return (
    <Container>
      <GovernancePageHeader title="Stats" subtitle="Overview of the mStable Governance system" />
      <div>
        <StatsBox
          tip={`In the event of recollateratalisation, your staked balance will be slashed by ${slashingPercentage}%. This rate may vary depending on future governance proposals.`}
          title="Collateralisation ratio"
          subtitle={`${collateralisationRatio}%`}
        />
        <StatsBox
          tip={`In the event of recollateratalisation, your staked balance will be slashed by ${slashingPercentage}%. This rate may vary depending on future governance proposals.`}
          title="Slashing percentage"
          subtitle={`${slashingPercentage}%`}
        />
        <StatsBox tip="The period of time before your stake is withdrawable" title="Withdrawal Cooldown" subtitle={`${cooldown}d`} />
        <StatsBox
          tip="The duration your stake is withdrawable after the cooldown"
          title="Withdrawal Period"
          subtitle={`${unstakeWindow}d`}
        />
      </div>
    </Container>
  )
}
