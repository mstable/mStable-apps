import React, { useMemo } from 'react'
import { useAccount } from '@apps/base/context/account'
import { MassetState, useDataState } from '@apps/data-provider'
import { CountUp } from '@apps/dumb-components'
import styled from 'styled-components'
import { useSelectedSaveVersion } from '../../context/SelectedSaveVersionProvider'
import { useTotalRewards } from './RewardsContext'
import { getPoolDeposited, getVaultDeposited, useWBTCPrice } from './utils'
import { ViewportWidth } from '@apps/theme'

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.color.background[0]};
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  border-radius: 1rem;
  padding: 1.25rem 1rem;
  text-align: center;

  h3 {
    font-size: 1rem;
    font-weight: 400;
    color: ${({ theme }) => theme.color.bodyAccent};
    margin-bottom: 0.75rem;
  }

  span {
    font-size: 1.125rem;
    color: ${({ theme }) => theme.color.body};
    font-weight: 400;
  }
`

const Items = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 1rem;

  > * {
    margin-bottom: 1rem;
  }

  @media (min-width: ${ViewportWidth.s}) {
    flex-direction: row;

    > * {
      flex-basis: calc(50% - 0.5rem);
      margin-bottom: 0;
    }
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
  const account = useAccount()
  const deposits = useDeposits()
  const { total } = useTotalRewards()

  if (!account) return null

  return (
    <Items>
      <Item>
        <h3>Your deposits</h3>
        <CountUp end={deposits} prefix="$" />
      </Item>
      <Item>
        <h3>MTA rewards</h3>
        <CountUp end={total} suffix="MTA" spaced />
      </Item>
    </Items>
  )
}
