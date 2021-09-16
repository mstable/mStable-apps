import { useTokenSubscription } from '@apps/base/context/tokens'
import { BigNumber, utils } from 'ethers'
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
  loading: boolean
  balance?: Balance
}

const ONE_DAY = BigNumber.from(60 * 60 * 24)
const SCALE = BigNumber.from((1e18).toString())

const calculateStakingApy = (
  priceCoefficient?: string,
  rewardRate?: BigNumber,
  rawBalance?: BigNumber,
  stakingBalance?: BigNumber,
  totalSupply?: BigNumber,
) => {
  if (!(rewardRate && stakingBalance && totalSupply && rawBalance) || (totalSupply && totalSupply.eq(0))) {
    return
  }

  // share = stakingBalance / totalSupply
  // dailyRewards = day * rewardRate
  // dailyReturn = (dailyRewards * share) / stakingBalance
  // percentage = dailyReturn * 365 * 100

  const maybePriceCoeff = BigNumber.from(priceCoefficient ?? 1)
  const priceScaledStakingBalance = maybePriceCoeff.mul(stakingBalance)
  const priceScaledRawBalance = maybePriceCoeff.mul(rawBalance)

  const share = priceScaledStakingBalance.mul(SCALE).div(totalSupply)
  if (share.eq(0)) {
    return
  }

  const dailyRewards = ONE_DAY.mul(rewardRate)
  const dailyReturn = dailyRewards.mul(share).div(priceScaledRawBalance)

  return parseFloat(utils.formatUnits(dailyReturn)) * 365 * 100
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

const Group: FC<GroupProps> = ({ balance, label, loading }) => {
  const { amount, symbol, suffix, decimals } = balance ?? {}
  return (
    <GroupContainer>
      <h3>{label}</h3>
      <div>
        {!loading ? (
          <div key={symbol}>
            {symbol && <StyledTokenIcon symbol={symbol} />}
            <CountUp end={amount} suffix={suffix} decimals={decimals} />
          </div>
        ) : (
          <ThemedSkeleton height={20} width={80} />
        )}
      </div>
    </GroupContainer>
  )
}

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
  const { data, loading } = useStakedTokenQuery()
  const rewardsEarned = useRewardsEarned()
  const stakedToken = useTokenSubscription(data?.stakedToken?.token.address)

  const values = useMemo<{
    baseRewardsApy?: Balance
    userRewardsApy?: Balance
    stake?: Balance
    votingPower?: Balance
    rewardsEarned?: Balance
  }>(() => {
    if (!data?.stakedToken?.accounts?.[0]?.balance) {
      return {}
    }

    const {
      stakedToken: {
        priceCoefficient,
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
    const rewardRate = BigNumber.from(_rewardRate)
    const cooldown = parseFloat(cooldownUnits) / 1e18

    const userRewardsApy = calculateStakingApy(
      priceCoefficient,
      rewardRate,
      rawBD?.exact,
      stakedToken?.balance?.exact,
      totalSupply?.bigDecimal.exact,
    )

    const baseRewardsApy = userRewardsApy / ((1 + questMultiplierSimple / 10) * (1 + timeMultiplierSimple / 10))

    return {
      stake: { amount: rawBD.simple + cooldown, symbol: data.stakedToken.stakingToken.symbol },
      votingPower: { amount: votesBD.simple, symbol: 'vMTA' },
      rewardsEarned: { decimals: 4, symbol: data.stakedToken.stakingRewards.rewardsToken.symbol, amount: rewardsEarned.rewards },
      baseRewardsApy: { suffix: '%', amount: baseRewardsApy },
      userRewardsApy: { suffix: '%', amount: userRewardsApy },
    }
  }, [data, rewardsEarned.rewards, stakedToken])

  return (
    <Container>
      <div>
        <Group label="My Stake" balance={values.stake} loading={loading} />
        <Group label="My Voting Power" balance={values.votingPower} loading={loading} />
      </div>
      <div>
        <Group label="Earned" balance={values.rewardsEarned} loading={loading} />
        <Group label="Base APY" balance={values.baseRewardsApy} loading={loading} />
        <Group label="My APY" balance={values.userRewardsApy} loading={loading} />
      </div>
    </Container>
  )
}
