import React, { useMemo } from 'react'
import type { FC } from 'react'
import { useAccount } from '@apps/base/context/account'
import { MassetState, useDataState } from '@apps/data-provider'
import { CountUp } from '@apps/dumb-components'
import styled from 'styled-components'
import { useSelectedSaveVersion } from '../../context/SelectedSaveVersionProvider'
import { useTotalRewards } from './RewardsContext'
import { getFraxDeposited, getFraxRewards, getPoolDeposited, getSaveDeposited, useWBTCPrice } from './utils'
import { ViewportWidth } from '@apps/theme'
import { useRewardsEarned, useStakingRewards } from '../Save/hooks'
import { useFraxStakingState } from '../../context/FraxStakingProvider'

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

  > *:last-child {
    h3 {
      position: relative;
    }

    h3:before {
      position: absolute;
      content: '';
      width: 0.5rem;
      height: 0.5rem;
      background: ${({ theme }) => theme.color.gold};
      right: -1rem;
      top: calc(50% - 0.25rem);
      border-radius: 0.25rem;
    }
  }

  @media (min-width: ${ViewportWidth.s}) {
    flex-direction: row;

    > * {
      flex-basis: calc(50% - 0.5rem);
      margin-bottom: 0;
    }
  }
`

const useDeposits = (tab: 'Pools' | 'Save') => {
  const dataState = useDataState()
  const wbtcPrice = useWBTCPrice()
  const polygonRewards = useStakingRewards()
  const { subscribedData: fraxSubscribedData } = useFraxStakingState()

  const frax = useMemo(() => getFraxDeposited(fraxSubscribedData?.value?.accountData), [fraxSubscribedData?.value])

  return useMemo(
    () =>
      Object.values(dataState).reduce((acc, curr: MassetState) => {
        const mPrice = curr?.token?.symbol === 'mBTC' ? wbtcPrice.value : 1
        const save = getSaveDeposited(curr, mPrice, polygonRewards).total.simple
        const pools = Object.values(curr.feederPools).reduce((ac, cu) => ac + getPoolDeposited(cu, mPrice).total, 0)
        if (tab === 'Pools') return acc + pools + (frax?.total ?? 0)
        return acc + save
      }, 0),
    [dataState, wbtcPrice.value, polygonRewards, frax, tab],
  )
}

export const Overview: FC<{ tab: 'Pools' | 'Save' }> = ({ tab }) => {
  const account = useAccount()
  const deposits = useDeposits(tab)
  const { unlocked: _unlocked } = useTotalRewards()
  const rewardsEarned = useRewardsEarned()
  const { subscribedData: fraxSubscribedData } = useFraxStakingState()

  const unlocked = (() => {
    const ethUnlocked = _unlocked

    const polygonUnlocked = (() => {
      let unlocked = rewardsEarned?.rewards?.find(v => v?.token === 'MTA')?.earned?.simple
      const fraxUnlocked = getFraxRewards(fraxSubscribedData?.value?.accountData)
      if (tab === 'Pools' && fraxUnlocked) {
        unlocked += fraxUnlocked
      }
      return unlocked
    })()

    return (polygonUnlocked ?? ethUnlocked) || 0
  })()

  if (!account) return null

  return (
    <Items>
      <Item>
        <h3>Your deposits</h3>
        <CountUp end={deposits} prefix="$" />
      </Item>
      <Item>
        <h3>Claimable rewards</h3>
        <CountUp end={unlocked} suffix="MTA" spaced />
      </Item>
    </Items>
  )
}
