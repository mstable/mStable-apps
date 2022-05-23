import { useMemo } from 'react'

import { useAccount } from '@apps/base/context/account'
import { useDataState } from '@apps/data-provider'
import { CountUp, Tooltip } from '@apps/dumb-components'
import { ViewportWidth } from '@apps/theme'
import styled from 'styled-components'

import { useFraxStakingState } from '../../context/FraxStakingProvider'
import { useRewardsEarned, useStakingRewards } from '../Save/hooks'
import { useTotalRewards } from './RewardsContext'
import { DashboardFilter as DF } from './types'
import { getFraxDeposited, getFraxRewards, getPoolDeposited, getSaveDeposited, isValidFeederPool, useMTAPrice, useWBTCPrice } from './utils'

import type { MassetState } from '@apps/data-provider'
import type { FC } from 'react'

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

const useDeposits = (tab: DF) => {
  const dataState = useDataState()
  const wbtcPrice = useWBTCPrice()
  const polygonRewards = useStakingRewards()
  const { subscribedData: fraxSubscribedData } = useFraxStakingState()

  return useMemo(
    () =>
      Object.values(dataState).reduce((acc, curr: MassetState) => {
        const mPrice = curr?.token?.symbol === 'mBTC' ? wbtcPrice.value : 1
        const save = getSaveDeposited(curr, mPrice, polygonRewards).total.simple
        const frax = getFraxDeposited(fraxSubscribedData?.value?.accountData)
        const pools = Object.values(curr.feederPools)
          .filter(isValidFeederPool)
          .reduce((ac, cu) => ac + getPoolDeposited(cu, mPrice).total, 0)

        switch (tab) {
          case DF.Save:
            return acc + save
          case DF.Pools:
            return acc + pools + (frax?.total ?? 0)
          default:
            return acc + save + pools + (frax?.total ?? 0)
        }
      }, 0),
    [dataState, wbtcPrice.value, polygonRewards, tab, fraxSubscribedData],
  )
}

export const Overview: FC<{ tab: DF }> = ({ tab }) => {
  const account = useAccount()
  const deposits = useDeposits(tab)
  const { unlocked: _unlocked } = useTotalRewards()
  const rewardsEarned = useRewardsEarned()
  const { subscribedData: fraxSubscribedData } = useFraxStakingState()
  const mtaPrice = useMTAPrice()

  const unlocked = (() => {
    const ethUnlocked = _unlocked

    const polygonUnlocked = (() => {
      let unlocked = rewardsEarned?.rewards?.find(v => v?.token === 'MTA')?.earned?.simple
      const fraxUnlocked = getFraxRewards(fraxSubscribedData?.value?.accountData)
      if (tab === DF.Pools && fraxUnlocked) {
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
        <Tooltip hideIcon tip={`$${(unlocked * mtaPrice.value).toFixed(2)}`}>
          <CountUp end={unlocked} suffix="MTA" spaced />
        </Tooltip>
      </Item>
    </Items>
  )
}
