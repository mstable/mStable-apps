import { useFetchPriceCtx } from '@apps/base/context/prices'
import { calculateApy } from '@apps/quick-maths'
import React, { FC, useMemo } from 'react'
import styled from 'styled-components'

import { CountUp, ThemedSkeleton } from '@apps/components/core'
import { TokenIcon } from '@apps/components/icons'
import { ViewportWidth } from '@apps/base/theme'

import { useStakedTokenQuery } from '../../context/StakedTokenProvider'
import { useRewardsEarned } from './context'

interface Balance {
  symbol?: string
  amount: number
  decimals?: number
  suffix?: string
}

interface GroupProps {
  label: string
  balances?: Balance[]
}

const StyledTokenIcon = styled(TokenIcon)`
  width: 1.5rem;
  height: auto;
`

const GroupContainer = styled.div`
  > :first-child {
    margin-bottom: 0.5rem;
  }

  > :last-child {
    display: flex;
    gap: 1rem;
    min-height: 1.5rem;

    > * {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  h3 {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  span {
    font-size: 1.125rem;
    font-weight: 300;
  }
`

const Group: FC<GroupProps> = ({ balances, label }) => (
  <GroupContainer>
    <h3>{label}</h3>
    <div>
      {balances ? (
        balances.map(({ amount, symbol, suffix, decimals }, key) => (
          <div key={symbol ?? key}>
            {symbol && <StyledTokenIcon symbol={symbol} />}
            <CountUp end={amount} suffix={suffix} decimals={decimals} />
          </div>
        ))
      ) : (
        <ThemedSkeleton height={20} width={80} />
      )}
    </div>
  </GroupContainer>
)

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 0.75rem;

  > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px ${({ theme }) => theme.color.defaultBorder} solid;
    padding: 1.5rem;
    border-radius: 1.5rem;
    gap: 1rem;
    flex: 1;
  }

  @media (min-width: ${ViewportWidth.m}) {
    > div {
      flex-direction: row;
    }
    > div:first-child {
      flex-basis: 60%;
    }
    > div:last-child {
      flex-basis: 40%;
    }
  }
`

export const StakeBalances: FC = () => {
  const { data } = useStakedTokenQuery()
  const rewardsEarned = useRewardsEarned()
  const useFetchPrice = useFetchPriceCtx()
  const mtaPrice = useFetchPrice('0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2') // MTA (Eth mainnet)

  const values = useMemo<{
    baseRewardsApy?: Balance[]
    userRewardsApy?: Balance[]
    stake?: Balance[]
    votingPower?: Balance[]
    rewardsEarned?: Balance[]
  }>(() => {
    if (!data?.stakedToken?.accounts?.[0]?.balance || !mtaPrice.value) {
      return {}
    }

    const {
      stakedToken: {
        token: { totalSupply },
        stakingRewards: { rewardRate: _rewardRate },
        accounts: [
          {
            balance: { rawBD, votesBD, cooldownUnits, questMultiplierSimple, timeMultiplierSimple },
          },
        ],
      },
    } = data

    // TODO use @client Apollo fields
    const rewardRate = parseInt(_rewardRate) / 1e18
    const cooldown = parseFloat(cooldownUnits) / 1e18

    const stakingTokenPrice =
      data.stakedToken.stakingToken.symbol === 'MTA'
        ? mtaPrice.value
        : // TODO check me (also priceCoeff is incorrect on Kovan/Ropsten)
          (mtaPrice.value * parseInt(data.stakedToken.priceCoefficient)) / 10000

    const multiplier = Math.max(1, questMultiplierSimple) * Math.max(1, timeMultiplierSimple)

    const baseRewardsApy = calculateApy(stakingTokenPrice, mtaPrice.value, rewardRate, totalSupply.bigDecimal)
    const userRewardsApy = calculateApy(stakingTokenPrice, mtaPrice.value, rewardRate * multiplier, totalSupply.bigDecimal)

    return {
      stake: [{ amount: rawBD.simple + cooldown, symbol: data.stakedToken.stakingToken.symbol }],
      votingPower: [{ amount: votesBD.simple, symbol: 'vMTA' }],
      rewardsEarned: [{ decimals: 6, symbol: data.stakedToken.stakingRewards.rewardsToken.symbol, amount: rewardsEarned.rewards }],
      baseRewardsApy: [{ suffix: '%', amount: baseRewardsApy }],
      userRewardsApy: [{ suffix: '%', amount: userRewardsApy }],
    }
  }, [data, mtaPrice.value, rewardsEarned.rewards])

  return (
    <Container>
      <div>
        <Group label="My Stake" balances={values.stake} />
        <Group label="My Voting Power" balances={values.votingPower} />
      </div>
      <div>
        <Group label="Rewards Earned" balances={values.rewardsEarned} />
        <Group label="Base APY" balances={values.baseRewardsApy} />
        <Group label="My APY" balances={values.userRewardsApy} />
      </div>
    </Container>
  )
}
