import { MassetState, useDataState } from '@apps/data-provider'
import { CountUp } from '@apps/dumb-components'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useSelectedSaveVersion } from '../../context/SelectedSaveVersionProvider'
import { useTotalRewards } from './RewardsContext'
import { Card, Panel, Title } from './Styled'
import { getPoolDeposited, getVaultDeposited, useWBTCPrice } from './utils'

export const Item = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > *:first-child {
    min-width: 20ch;
  }
`

const useDeposits = () => {
  const dataState = useDataState()
  const wbtcPrice = useWBTCPrice()
  const [selectedSaveVersion] = useSelectedSaveVersion()

  return useMemo(
    () =>
      Object.values(dataState).reduce((acc, curr: MassetState) => {
        const mPrice = curr?.token?.symbol === 'mBTC' ? wbtcPrice.value : 1
        const vaults = getVaultDeposited(selectedSaveVersion, curr, mPrice).simple
        const pools = Object.values(curr.feederPools).reduce((ac, cu) => ac + getPoolDeposited(cu, mPrice), 0)

        return acc + vaults + pools
      }, 0),
    [dataState, selectedSaveVersion, wbtcPrice.value],
  )
}

export const Overview = () => {
  const deposits = useDeposits()
  const { total, claimed, pending } = useTotalRewards()

  return (
    <div>
      <Title>Overview</Title>
      <Card>
        <Panel>
          <Item>
            <span>My deposits</span>
            <CountUp end={deposits} prefix="$" />
          </Item>
          <Item>
            <span>Pending rewards</span>
            <CountUp end={pending} suffix="MTA" />
          </Item>
          <Item>
            <span>Claimed rewards</span>
            <CountUp end={claimed} suffix="MTA" />
          </Item>
          <Item>
            <span>Total rewards</span>
            <CountUp end={total} suffix="MTA" />
          </Item>
        </Panel>
      </Card>
    </div>
  )
}
